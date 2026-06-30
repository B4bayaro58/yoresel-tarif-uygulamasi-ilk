import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ShoppingCart, Trash2, CheckSquare, Plus } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';

export default function ShoppingListScreen({ navigation }) {
  const {
    colors,
    translate,
    shoppingList,
    addToShoppingList,
    toggleShoppingItem,
    deleteShoppingItem,
    deleteSelectedShoppingItems,
    clearShoppingList,
  } = useApp();

  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const amountRef = useRef(null);

  const hasSelectedItems = shoppingList.some(item => item.checked);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${translate('shoppingList')} (${shoppingList.length})`,
    });
  }, [navigation, translate, shoppingList.length]);

  const handleAdd = () => {
    const name = itemName.trim();
    if (!name) return;
    addToShoppingList({ name, amount: itemAmount.trim() });
    setItemName('');
    setItemAmount('');
  };

  const ListHeader = (
    <>
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
            >
              <CheckSquare size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>{translate('deleteSelected')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.textSecondary }]}
            onPress={clearShoppingList}
          >
            <Trash2 size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{translate('clearAll')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ShoppingCart size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
              {translate('noShoppingItems')}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
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
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteShoppingItem(item.id)}
            >
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />
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
  deleteButton: {
    padding: 8,
  },
});
