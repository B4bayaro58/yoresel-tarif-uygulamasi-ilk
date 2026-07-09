import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Check, Search } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';

export default function DailyMenuScreen({ navigation }) {
  const {
    colors,
    translate,
    recipes,
    dailyMenuIds,
    dailyMenuLoading,
    saveDailyMenu,
    showNotification,
  } = useApp();

  const [selected, setSelected] = useState(new Set(dailyMenuIds));
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return recipes;
    const q = query.toLowerCase();
    return recipes.filter(r => r.name.toLowerCase().includes(q) || r.country.toLowerCase().includes(q));
  }, [recipes, query]);

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 5) {
          Alert.alert('', translate('selectRecipesForMenu'));
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  }, [translate]);

  const handleSave = async () => {
    setSaving(true);
    const result = await saveDailyMenu(Array.from(selected));
    setSaving(false);
    if (result.success) {
      showNotification(translate('dailyMenuSaved'));
      navigation.goBack();
    } else {
      showNotification(translate('dailyMenuSaveFailed'));
    }
  };

  const renderItem = useCallback(({ item }) => {
    // Override edilmiş statik tariflerde item.id kendi Firebase ID'si — gerçek
    // "kanonik" kimlik overridesStaticId'dir (dailyMenuIds bunu saklar). Bu
    // olmadan override edilmiş tarifler her zaman "seçilmemiş" görünür ve
    // kaydedince menüden düşerdi (bkz. maliyet denetimi notları, web'deki
    // aynı hata için commit 9ff3cca).
    const canonicalId = item.overridesStaticId ?? item.id;
    const isSelected = selected.has(canonicalId);
    return (
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.card, borderColor: isSelected ? colors.primary : colors.border },
          isSelected && { borderWidth: 2 },
        ]}
        onPress={() => toggle(canonicalId)}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.itemCountry, { color: colors.textSecondary }]}>{item.city ? `${item.country}, ${item.city}` : item.country}</Text>
        </View>
        <View style={[
          styles.checkbox,
          {
            backgroundColor: isSelected ? colors.primary : 'transparent',
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}>
          {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
        </View>
      </TouchableOpacity>
    );
  }, [selected, colors, toggle]);

  if (dailyMenuLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={translate('searchRecipe')}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      {/* Selected count */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>
          {translate('selectedCount', { count: selected.size })}
        </Text>
        <Text style={[styles.hintText, { color: colors.textTertiary }]}>
          {translate('selectRecipesForMenu')}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Save button */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving
            ? <ActivityIndicator size="small" color="#FFFFFF" />
            : <Text style={styles.saveButtonText}>{translate('save')}</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  countRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: { fontSize: 14, fontWeight: '700' },
  hintText: { fontSize: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  emoji: { fontSize: 32, marginRight: 14 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  itemCountry: { fontSize: 13 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
