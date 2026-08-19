import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { ShoppingCart, Trash2, CheckSquare, Plus, LayoutGrid, Tag, ChefHat } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { GROCERY_CATEGORIES, DEFAULT_GROCERY_CATEGORY } from '../constants/groceryCategories';
import LockedFeature from '../components/LockedFeature';

export default function ShoppingListScreen({ navigation }) {
  const {
    colors,
    translate,
    shoppingList,
    addToShoppingList,
    toggleShoppingItem,
    updateShoppingItemCategory,
    deleteShoppingItem,
    deleteSelectedShoppingItems,
    clearShoppingList,
  } = useApp();
  const { isGuest } = useAuth();
  const { isPremium } = useSubscription();

  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [groupMode, setGroupMode] = useState('none'); // 'none' | 'category' | 'recipe'
  const [categoryPickerItemId, setCategoryPickerItemId] = useState(null);
  const amountRef = useRef(null);

  const hasSelectedItems = shoppingList.some(item => item.checked);
  const showGrouped = groupMode !== 'none' && isPremium;

  const handleGroupModePress = (mode) => {
    if (!isPremium) {
      navigation.navigate('Paywall');
      return;
    }
    setGroupMode(prev => (prev === mode ? 'none' : mode));
  };

  const sections = useMemo(() => {
    if (!showGrouped) return [];

    if (groupMode === 'category') {
      const grouped = {};
      shoppingList.forEach(item => {
        const catId = item.category || DEFAULT_GROCERY_CATEGORY;
        if (!grouped[catId]) grouped[catId] = [];
        grouped[catId].push(item);
      });
      return GROCERY_CATEGORIES
        .map(cat => ({ id: cat.id, title: translate(cat.translationKey), data: grouped[cat.id] || [] }))
        .filter(section => section.data.length > 0);
    }

    // groupMode === 'recipe'
    const grouped = {};
    const order = [];
    const manualItems = [];
    shoppingList.forEach(item => {
      if (!item.recipeId) {
        manualItems.push(item);
        return;
      }
      if (!grouped[item.recipeId]) {
        grouped[item.recipeId] = { title: item.recipeName || item.recipeId, data: [] };
        order.push(item.recipeId);
      }
      grouped[item.recipeId].data.push(item);
    });
    const result = order.map(id => ({ id, title: grouped[id].title, data: grouped[id].data }));
    if (manualItems.length > 0) {
      result.push({ id: '__manual__', title: translate('manualItems'), data: manualItems });
    }
    return result;
  }, [showGrouped, groupMode, shoppingList, translate]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${translate('shoppingList')} (${shoppingList.length})`,
    });
  }, [navigation, translate, shoppingList.length]);

  if (isGuest) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LockedFeature
          title={translate('loginRequiredTitle')}
          message={translate('shoppingListLoginRequired')}
        />
      </View>
    );
  }

  const handleAdd = () => {
    const name = itemName.trim();
    if (!name) return;
    addToShoppingList({ name, amount: itemAmount.trim() });
    setItemName('');
    setItemAmount('');
  };

  const ListHeader = (
    <>
      {/* Kategoriye / Tarife göre ayır -- Premium */}
      <View style={styles.groupModeRow}>
        <TouchableOpacity
          style={[
            styles.groupModeButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            groupMode === 'category' && { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
          onPress={() => handleGroupModePress('category')}
          accessibilityRole="button"
          accessibilityLabel={translate('groupByCategory')}
          accessibilityState={{ selected: groupMode === 'category' }}
        >
          <LayoutGrid size={16} color={groupMode === 'category' ? '#FFFFFF' : colors.primary} />
          <Text
            style={[
              styles.groupModeText,
              { color: groupMode === 'category' ? '#FFFFFF' : colors.text },
            ]}
          >
            {translate('groupByCategory')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.groupModeButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            groupMode === 'recipe' && { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
          onPress={() => handleGroupModePress('recipe')}
          accessibilityRole="button"
          accessibilityLabel={translate('groupByRecipe')}
          accessibilityState={{ selected: groupMode === 'recipe' }}
        >
          <ChefHat size={16} color={groupMode === 'recipe' ? '#FFFFFF' : colors.primary} />
          <Text
            style={[
              styles.groupModeText,
              { color: groupMode === 'recipe' ? '#FFFFFF' : colors.text },
            ]}
          >
            {translate('groupByRecipe')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Manuel ekleme formu */}
      <View style={[styles.addForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.addInputs}>
          <TextInput
            style={[styles.nameInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder={translate('itemName')}
            placeholderTextColor={colors.textTertiary}
            value={itemName}
            onChangeText={setItemName}
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="next"
            onSubmitEditing={() => amountRef.current?.focus()}
          />
          <TextInput
            ref={amountRef}
            style={[styles.amountInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder={translate('itemAmount')}
            placeholderTextColor={colors.textTertiary}
            value={itemAmount}
            onChangeText={setItemAmount}
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }, !itemName.trim() && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={!itemName.trim()}
          accessibilityRole="button"
          accessibilityLabel={translate('addItem')}
        >
          <Plus size={22} color="#FFFFFF" />
          <Text style={styles.addButtonText}>{translate('addItem')}</Text>
        </TouchableOpacity>
      </View>

      {/* Toplu işlem butonları */}
      {(hasSelectedItems || shoppingList.length > 0) && (
        <View style={styles.actionsContainer}>
          {hasSelectedItems && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={deleteSelectedShoppingItems}
              accessibilityRole="button"
              accessibilityLabel={translate('deleteSelected')}
            >
              <CheckSquare size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>{translate('deleteSelected')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.textSecondary }]}
            onPress={clearShoppingList}
            accessibilityRole="button"
            accessibilityLabel={translate('clearAll')}
          >
            <Trash2 size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{translate('clearAll')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderShoppingItem = ({ item }) => (
    <View
      style={[
        styles.listItem,
        { backgroundColor: colors.card, borderColor: colors.border },
        item.checked && { opacity: 0.5 },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: colors.border },
          item.checked && { backgroundColor: colors.success, borderColor: colors.success },
        ]}
        onPress={() => toggleShoppingItem(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.checked }}
        accessibilityLabel={item.name}
      >
        {item.checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.itemInfo}>
        <Text
          style={[
            styles.itemName,
            { color: colors.text },
            item.checked && { textDecorationLine: 'line-through' },
          ]}
        >
          {item.name}
        </Text>
        {!!item.amount && (
          <Text style={[styles.itemAmount, { color: colors.textSecondary }]}>
            {item.amount}
          </Text>
        )}
        {showGrouped && groupMode !== 'recipe' && !!item.recipeName && (
          <Text style={[styles.itemRecipeTag, { color: colors.primary }]}>
            {translate('forRecipe', { recipe: item.recipeName })}
          </Text>
        )}
      </View>

      {showGrouped && (
        <TouchableOpacity
          style={[styles.categoryChip, { borderColor: colors.primary }]}
          onPress={() => setCategoryPickerItemId(item.id)}
          accessibilityRole="button"
          accessibilityLabel={translate('groupByCategory')}
        >
          <Tag size={14} color={colors.primary} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteShoppingItem(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} ürününü sil`}
      >
        <Trash2 size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  const EmptyState = (
    <View style={styles.emptyState}>
      <ShoppingCart size={48} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
        {translate('noShoppingItems')}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      {showGrouped ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyState}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
              {section.title} ({section.data.length})
            </Text>
          )}
          renderItem={renderShoppingItem}
        />
      ) : (
        <FlatList
          data={shoppingList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={true}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyState}
          renderItem={renderShoppingItem}
        />
      )}

      {/* Kategori seçici -- Premium, sadece gruplu görünümde */}
      <Modal
        visible={!!categoryPickerItemId}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryPickerItemId(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCategoryPickerItemId(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {translate('groupByCategory')}
            </Text>
            {GROCERY_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.modalItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  updateShoppingItemCategory(categoryPickerItemId, cat.id);
                  setCategoryPickerItemId(null);
                }}
                accessibilityRole="button"
              >
                <Text style={[styles.modalItemText, { color: colors.text }]}>
                  {translate(cat.translationKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  addForm: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  addInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  amountInput: {
    width: 110,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonDisabled: {
    opacity: 0.45,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemAmount: {
    fontSize: 13,
  },
  itemRecipeTag: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  groupModeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  groupModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  groupModeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  categoryChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
