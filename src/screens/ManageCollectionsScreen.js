import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Check, Search, Plus, Edit3, Trash2, ArrowLeft, X } from 'lucide-react-native';
import { collection, getDocs, doc, addDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../contexts/AppContext';

const EMPTY_FORM = { title: '', subtitle: '', coverPhoto: '', region: '', order: 0, isActive: true, recipeIds: [] };

export default function ManageCollectionsScreen() {
  const { colors, translate, recipes, showNotification } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('list'); // 'list' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'collections'));
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setItems(data);
    } catch (error) {
      console.error('Koleksiyonlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setQuery('');
    setMode('edit');
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      coverPhoto: item.coverPhoto || '',
      region: item.region || '',
      order: item.order ?? 0,
      isActive: item.isActive ?? true,
      recipeIds: item.recipeIds || [],
    });
    setQuery('');
    setMode('edit');
  };

  const handleDelete = (item) => {
    Alert.alert(
      translate('delete'),
      item.title,
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'collections', item.id));
              setItems(prev => prev.filter(c => c.id !== item.id));
            } catch (error) {
              console.error('Koleksiyon silinemedi:', error);
            }
          },
        },
      ]
    );
  };

  const toggleRecipe = (id) => {
    setForm(prev => {
      const has = prev.recipeIds.includes(id);
      return { ...prev, recipeIds: has ? prev.recipeIds.filter(r => r !== id) : [...prev.recipeIds, id] };
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const data = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        coverPhoto: form.coverPhoto.trim(),
        region: form.region.trim(),
        order: Number(form.order) || 0,
        isActive: form.isActive,
        recipeIds: form.recipeIds,
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await setDoc(doc(db, 'collections', editingId), data, { merge: true });
      } else {
        await addDoc(collection(db, 'collections'), { ...data, createdAt: serverTimestamp() });
      }
      showNotification(translate('save'));
      setMode('list');
      load();
    } catch (error) {
      console.error('Koleksiyon kaydedilemedi:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredRecipes = useMemo(() => {
    if (!query.trim()) return recipes;
    const q = query.toLowerCase();
    return recipes.filter(r => r.name.toLowerCase().includes(q) || (r.country || '').toLowerCase().includes(q));
  }, [recipes, query]);

  const selectedRecipes = useMemo(
    () => form.recipeIds
      .map(id => recipes.find(r => String(r.id) === id) || recipes.find(r => String(r.overridesStaticId) === id))
      .filter(Boolean),
    [form.recipeIds, recipes]
  );

  if (mode === 'list') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {items.length} koleksiyon
          </Text>
          <TouchableOpacity
            style={[styles.newButton, { backgroundColor: colors.primary }]}
            onPress={openNew}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Yeni Koleksiyon"
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.newButtonText}>Yeni Koleksiyon</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Henüz koleksiyon oluşturulmadı.</Text>
            }
            renderItem={({ item }) => (
              <View style={[styles.collectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.collectionInfo}>
                  <Text style={[styles.collectionTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={[styles.collectionMeta, { color: colors.textSecondary }]}>
                    {(item.recipeIds || []).length} tarif{item.region ? ` • ${item.region}` : ''} • {item.isActive ? 'Yayında' : 'Pasif'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#3B82F620' }]}
                  onPress={() => openEdit(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title} — Düzenle`}
                >
                  <Edit3 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#EF444420' }]}
                  onPress={() => handleDelete(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title} — Sil`}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => setMode('list')}
          accessibilityRole="button"
          accessibilityLabel={translate('back')}
        >
          <ArrowLeft size={18} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Koleksiyonlar</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Başlık *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          value={form.title}
          onChangeText={t => setForm(p => ({ ...p, title: t }))}
          placeholder="Sivas'tan Sofranıza: Modern Yorumlar"
          placeholderTextColor={colors.textTertiary}
          autoCorrect={false}
          spellCheck={false}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Alt Başlık</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          value={form.subtitle}
          onChangeText={t => setForm(p => ({ ...p, subtitle: t }))}
          placeholder="Yöresel köklerini koruyan modern tarifler"
          placeholderTextColor={colors.textTertiary}
          autoCorrect={false}
          spellCheck={false}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Kapak Fotoğrafı (URL)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          value={form.coverPhoto}
          onChangeText={t => setForm(p => ({ ...p, coverPhoto: t }))}
          placeholder="https://..."
          placeholderTextColor={colors.textTertiary}
          autoCorrect={false}
          spellCheck={false}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Yöre (opsiyonel — Yöresel Keşif rayı için)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          value={form.region}
          onChangeText={t => setForm(p => ({ ...p, region: t }))}
          placeholder="Sivas"
          placeholderTextColor={colors.textTertiary}
          autoCorrect={false}
          spellCheck={false}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Sıra</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              value={String(form.order)}
              onChangeText={t => setForm(p => ({ ...p, order: t.replace(/[^0-9]/g, '') }))}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.activeRow}>
            <Text style={[styles.label, { color: colors.textSecondary, marginBottom: 0 }]}>Yayında</Text>
            <Switch
              value={form.isActive}
              onValueChange={v => setForm(p => ({ ...p, isActive: v }))}
              trackColor={{ true: colors.primary }}
            />
          </View>
        </View>

        {/* Selected recipes */}
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 8 }]}>
          Koleksiyondaki Tarifler ({selectedRecipes.length})
        </Text>
        <View style={styles.selectedWrap}>
          {selectedRecipes.map(r => (
            <View key={r.id} style={[styles.selectedChip, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.selectedChipText, { color: colors.primary }]} numberOfLines={1}>{r.name}</Text>
              <TouchableOpacity
                onPress={() => toggleRecipe(String(r.id))}
                accessibilityRole="button"
                accessibilityLabel={`${r.name} — Koleksiyondan Çıkar`}
              >
                <X size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Recipe search + picker */}
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

        {filteredRecipes.slice(0, 40).map(item => {
          const canonicalId = String(item.overridesStaticId ?? item.id);
          const isSelected = form.recipeIds.includes(canonicalId);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.pickerItem,
                { backgroundColor: colors.card, borderColor: isSelected ? colors.primary : colors.border },
                isSelected && { borderWidth: 2 },
              ]}
              onPress={() => toggleRecipe(canonicalId)}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={item.name}
            >
              <Text style={styles.pickerEmoji}>{item.emoji}</Text>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.itemCountry, { color: colors.textSecondary }]}>{item.country}</Text>
              </View>
              <View style={[
                styles.checkbox,
                { backgroundColor: isSelected ? colors.primary : 'transparent', borderColor: isSelected ? colors.primary : colors.border },
              ]}>
                {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }, (saving || !form.title.trim()) && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving || !form.title.trim()}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={translate('save')}
        >
          {saving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.saveButtonText}>{translate('save')}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  subtitle: { fontSize: 14, fontWeight: '600' },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  newButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 15 },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  collectionInfo: { flex: 1 },
  collectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  collectionMeta: { fontSize: 12 },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: { padding: 16 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { fontSize: 15, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  activeRow: { alignItems: 'flex-start', gap: 6, paddingBottom: 4 },
  selectedWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    maxWidth: 200,
  },
  selectedChipText: { fontSize: 12, fontWeight: '700', flexShrink: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  pickerEmoji: { fontSize: 26, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  itemCountry: { fontSize: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
