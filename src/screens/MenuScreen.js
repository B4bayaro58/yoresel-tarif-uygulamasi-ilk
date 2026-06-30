import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Clock, Plus, X, Check, Search } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import RecipeCard from '../components/RecipeCard';

const { width } = Dimensions.get('window');

// Günün menüsü yatay kart (HomeScreen'dekinin aynısı)
function DailyMenuCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.dailyCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={item.gradient || ['#4A6CF7', '#3A5CE5']}
        style={styles.dailyCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.dailyCardEmoji}>{item.emoji}</Text>
        <View style={styles.dailyCardInfo}>
          <Text style={styles.dailyCardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.dailyCardCountry} numberOfLines={1}>{item.country}</Text>
          <View style={styles.dailyCardMeta}>
            <View style={styles.dailyCardMetaItem}>
              <Star size={11} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.9)" />
              <Text style={styles.dailyCardMetaText}>{item.rating}</Text>
            </View>
            <View style={styles.dailyCardMetaItem}>
              <Clock size={11} color="rgba(255,255,255,0.9)" />
              <Text style={styles.dailyCardMetaText}>{item.prepTime} dk</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// Kendi menüm satır öğesi
function MyMenuItem({ item, onRemove, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[styles.myMenuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.gradient || ['#4A6CF7', '#3A5CE5']}
        style={styles.myMenuItemThumb}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.myMenuItemEmoji}>{item.emoji}</Text>
      </LinearGradient>
      <View style={styles.myMenuItemInfo}>
        <Text style={[styles.myMenuItemName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.myMenuItemCountry, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.country}
        </Text>
        <View style={styles.myMenuItemMeta}>
          <Clock size={12} color={colors.textTertiary} />
          <Text style={[styles.myMenuItemMetaText, { color: colors.textTertiary }]}>
            {item.prepTime} dk
          </Text>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={[styles.myMenuItemMetaText, { color: colors.textTertiary }]}>
            {item.rating}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.removeBtn, { backgroundColor: colors.error + '20' }]}
        onPress={onRemove}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <X size={16} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// Tarif seçme modalı
function RecipePickerModal({ visible, onClose, colors, translate, recipes, personalMenuIds, togglePersonalMenu }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return recipes;
    const q = query.toLowerCase();
    return recipes.filter(r =>
      r.name.toLowerCase().includes(q) || r.country.toLowerCase().includes(q)
    );
  }, [query, recipes]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
        {/* Başlık */}
        <View style={[styles.pickerHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.pickerTitle, { color: colors.text }]}>
            {translate('pickRecipe')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.pickerClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Arama */}
        <View style={[styles.pickerSearch, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={[styles.pickerSearchInput, { color: colors.text }]}
            placeholder={translate('search')}
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            spellCheck={false}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Liste */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.pickerList}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isIn = personalMenuIds.includes(item.id);
            return (
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  { backgroundColor: colors.card, borderColor: isIn ? colors.primary : colors.border },
                  isIn && { borderWidth: 2 },
                ]}
                onPress={() => togglePersonalMenu(item.id)}
                activeOpacity={0.75}
              >
                <LinearGradient
                  colors={item.gradient || ['#4A6CF7', '#3A5CE5']}
                  style={styles.pickerItemThumb}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.pickerItemEmoji}>{item.emoji}</Text>
                </LinearGradient>
                <View style={styles.pickerItemInfo}>
                  <Text style={[styles.pickerItemName, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.pickerItemCountry, { color: colors.textSecondary }]} numberOfLines={1}>
                    {item.country}
                  </Text>
                </View>
                <View style={[
                  styles.pickerItemCheck,
                  { backgroundColor: isIn ? colors.primary : colors.border },
                ]}>
                  {isIn && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

export default function MenuScreen({ navigation }) {
  const {
    colors,
    translate,
    recipes,
    dailyMenu,
    dailyMenuLoading,
    personalMenuRecipes,
    personalMenuIds,
    togglePersonalMenu,
  } = useApp();

  const [pickerVisible, setPickerVisible] = useState(false);

  const handleRecipePress = useCallback((recipe) => {
    navigation.navigate('RecipeDetail', { recipe });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Günün Menüsü ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {translate('dailyMenu')}
          </Text>

          {dailyMenuLoading ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>...</Text>
            </View>
          ) : dailyMenu.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {translate('dailyMenuEmpty')}
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dailyMenuRow}
            >
              {dailyMenu.map(item => (
                <DailyMenuCard
                  key={item.id}
                  item={item}
                  onPress={() => handleRecipePress(item)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* ── Kendi Menüm ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {translate('myMenu')}
            </Text>
            {personalMenuRecipes.length > 0 && (
              <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.countBadgeText}>{personalMenuRecipes.length}</Text>
              </View>
            )}
          </View>

          {personalMenuRecipes.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={[styles.emptyCardTitle, { color: colors.text }]}>
                {translate('myMenuEmpty')}
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {translate('myMenuEmptyHint')}
              </Text>
            </View>
          ) : (
            <View style={styles.myMenuList}>
              {personalMenuRecipes.map(item => (
                <MyMenuItem
                  key={item.id}
                  item={item}
                  colors={colors}
                  onPress={() => handleRecipePress(item)}
                  onRemove={() => togglePersonalMenu(item.id)}
                />
              ))}
            </View>
          )}

          {/* Tarif Ekle butonu */}
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => setPickerVisible(true)}
            activeOpacity={0.85}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addBtnText}>{translate('pickRecipe')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <RecipePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        colors={colors}
        translate={translate}
        recipes={recipes}
        personalMenuIds={personalMenuIds}
        togglePersonalMenu={togglePersonalMenu}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  countBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  countBadgeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Günün menüsü
  dailyMenuRow: { paddingRight: 4 },
  dailyCard: {
    width: 160,
    height: 200,
    borderRadius: 18,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  dailyCardGradient: { flex: 1, padding: 14, justifyContent: 'space-between' },
  dailyCardEmoji: { fontSize: 44 },
  dailyCardInfo: { gap: 3 },
  dailyCardName: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', lineHeight: 18 },
  dailyCardCountry: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  dailyCardMeta: { flexDirection: 'row', gap: 10, marginTop: 4 },
  dailyCardMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dailyCardMetaText: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },

  // Boş durum
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  emptyEmoji: { fontSize: 36, marginBottom: 4 },
  emptyCardTitle: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  emptyText: { fontSize: 13, textAlign: 'center' },

  // Kendi menüm liste
  myMenuList: { gap: 10, marginBottom: 14 },
  myMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  myMenuItemThumb: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myMenuItemEmoji: { fontSize: 28 },
  myMenuItemInfo: { flex: 1, paddingHorizontal: 12, gap: 2 },
  myMenuItemName: { fontSize: 15, fontWeight: '700' },
  myMenuItemCountry: { fontSize: 12 },
  myMenuItemMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  myMenuItemMetaText: { fontSize: 12 },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  // Tarif ekle butonu
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // Picker modal
  pickerContainer: { flex: 1 },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 52,
    borderBottomWidth: 1,
  },
  pickerTitle: { fontSize: 20, fontWeight: '700' },
  pickerClose: { padding: 4 },
  pickerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerSearchInput: { flex: 1, fontSize: 15 },
  pickerList: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pickerItemThumb: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemEmoji: { fontSize: 24 },
  pickerItemInfo: { flex: 1, paddingHorizontal: 12 },
  pickerItemName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  pickerItemCountry: { fontSize: 12 },
  pickerItemCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
