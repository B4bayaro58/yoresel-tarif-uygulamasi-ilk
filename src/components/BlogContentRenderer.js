import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { Image } from 'expo-image';

// TipTap JSON belgesini (web'deki blog editörünün ürettiği aynı format,
// bkz. web/src/lib/blogEditor/extensions.ts) native RN elemanlarına çeviren
// küçük, özel bir recursive renderer. İçerik HTML değil yapılandırılmış JSON
// olduğundan WebView/react-native-render-html yerine doğrudan native render
// tercih edildi — hem daha basit hem uygulamanın geri kalanıyla tutarlı.
//
// Desteklenen node tipleri, web editörünün extension set'iyle (StarterKit +
// heading[2,3] + Link + recipeCard/recipeLink) birebir sınırlıdır.

function resolveRecipe(recipes, recipeId) {
  if (!recipeId || !recipes) return null;
  return (
    recipes.find(r => String(r.id) === String(recipeId)) ||
    recipes.find(r => String(r.overridesStaticId) === String(recipeId)) ||
    null
  );
}

function TextNode({ node, colors }) {
  const marks = node.marks || [];
  const style = [styles.body, { color: colors.text }];
  let href;

  marks.forEach(mark => {
    if (mark.type === 'bold') style.push({ fontWeight: '700' });
    else if (mark.type === 'italic') style.push({ fontStyle: 'italic' });
    else if (mark.type === 'strike') style.push({ textDecorationLine: 'line-through' });
    else if (mark.type === 'code') {
      style.push({
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        backgroundColor: colors.card,
        paddingHorizontal: 4,
        borderRadius: 4,
      });
    } else if (mark.type === 'link') {
      href = mark.attrs?.href;
      style.push({ color: colors.primary, textDecorationLine: 'underline' });
    }
  });

  return (
    <Text style={style} onPress={href ? () => Linking.openURL(href).catch(() => {}) : undefined}>
      {node.text}
    </Text>
  );
}

function RecipeLinkNode({ node, recipes, colors, navigation, translate }) {
  const recipe = resolveRecipe(recipes, node.attrs?.recipeId);
  return (
    <Text
      style={[styles.recipeLinkChip, { color: colors.primary, backgroundColor: colors.primary + '1A' }]}
      onPress={() => recipe && navigation.navigate('RecipeDetail', { recipe })}
    >
      {'  '}{recipe?.emoji || '🍽️'} {recipe?.name || translate('recipeUnavailable')} ›{'  '}
    </Text>
  );
}

function renderInline(content, ctx) {
  if (!content) return null;
  return content.map((node, i) => {
    if (node.type === 'text') return <TextNode key={i} node={node} colors={ctx.colors} />;
    if (node.type === 'hardBreak') return <Text key={i}>{'\n'}</Text>;
    if (node.type === 'recipeLink') return <RecipeLinkNode key={i} node={node} {...ctx} />;
    return null;
  });
}

function Paragraph({ node, ...ctx }) {
  const children = renderInline(node.content, ctx);
  if (!children || children.length === 0) return <View style={styles.emptyParagraph} />;
  return <Text style={[styles.body, { color: ctx.colors.text }]}>{children}</Text>;
}

function Heading({ node, ...ctx }) {
  const level = node.attrs?.level || 2;
  const children = renderInline(node.content, ctx);
  return <Text style={[level === 2 ? styles.h2 : styles.h3, { color: ctx.colors.text }]}>{children}</Text>;
}

function BlockQuote({ node, ...ctx }) {
  return (
    <View style={[styles.blockquote, { borderLeftColor: ctx.colors.primary }]}>
      {(node.content || []).map((child, i) => <BlockNode key={i} node={child} {...ctx} />)}
    </View>
  );
}

function ListNode({ node, ordered, ...ctx }) {
  return (
    <View style={styles.list}>
      {(node.content || []).map((item, i) => (
        <View key={i} style={styles.listItemRow}>
          <Text style={[styles.listMarker, { color: ctx.colors.textSecondary }]}>{ordered ? `${i + 1}.` : '•'}</Text>
          <View style={{ flex: 1 }}>
            {(item.content || []).map((child, j) => <BlockNode key={j} node={child} {...ctx} />)}
          </View>
        </View>
      ))}
    </View>
  );
}

function RecipeCardNode({ node, recipes, colors, navigation, translate }) {
  const recipe = resolveRecipe(recipes, node.attrs?.recipeId);
  return (
    <TouchableOpacity
      style={[styles.recipeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.85}
      disabled={!recipe}
      onPress={() => recipe && navigation.navigate('RecipeDetail', { recipe })}
    >
      {recipe?.photo ? (
        <Image source={{ uri: recipe.photoThumb || recipe.photo }} style={styles.recipeCardImg} contentFit="cover" />
      ) : (
        <View style={[styles.recipeCardImg, styles.recipeCardImgFallback, { backgroundColor: colors.primary + '22' }]}>
          <Text style={{ fontSize: 26 }}>{recipe?.emoji || '🍽️'}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.recipeCardEyebrow, { color: colors.primary }]}>{translate('recipeCardEyebrow')}</Text>
        <Text style={[styles.recipeCardName, { color: colors.text }]} numberOfLines={1}>
          {recipe?.name || translate('recipeUnavailable')}
        </Text>
        {!!recipe?.country && <Text style={[styles.recipeCardCountry, { color: colors.textSecondary }]}>{recipe.country}</Text>}
      </View>
    </TouchableOpacity>
  );
}

function BlockNode({ node, ...ctx }) {
  switch (node.type) {
    case 'paragraph':
      return <Paragraph node={node} {...ctx} />;
    case 'heading':
      return <Heading node={node} {...ctx} />;
    case 'bulletList':
      return <ListNode node={node} ordered={false} {...ctx} />;
    case 'orderedList':
      return <ListNode node={node} ordered {...ctx} />;
    case 'blockquote':
      return <BlockQuote node={node} {...ctx} />;
    case 'horizontalRule':
      return <View style={[styles.hr, { backgroundColor: ctx.colors.border }]} />;
    case 'recipeCard':
      return <RecipeCardNode node={node} {...ctx} />;
    default:
      return null;
  }
}

export default function BlogContentRenderer({ content, recipes, colors, navigation, translate }) {
  if (!content?.content?.length) return null;
  const ctx = { recipes, colors, navigation, translate };
  return (
    <View>
      {content.content.map((node, i) => <BlockNode key={i} node={node} {...ctx} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 15, lineHeight: 26 },
  emptyParagraph: { height: 12 },
  h2: { fontSize: 22, fontWeight: '800', marginTop: 20, marginBottom: 8, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 6, lineHeight: 24 },
  blockquote: {
    borderLeftWidth: 3,
    paddingLeft: 14,
    marginVertical: 12,
  },
  hr: { height: 1, marginVertical: 20 },
  list: { marginVertical: 8 },
  listItemRow: { flexDirection: 'row', marginBottom: 6 },
  listMarker: { width: 22, fontSize: 15, fontWeight: '700' },
  recipeLinkChip: {
    fontSize: 14,
    fontWeight: '700',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 10,
  },
  recipeCardImg: { width: 56, height: 56, borderRadius: 12 },
  recipeCardImgFallback: { alignItems: 'center', justifyContent: 'center' },
  recipeCardEyebrow: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  recipeCardName: { fontSize: 14, fontWeight: '800' },
  recipeCardCountry: { fontSize: 12, marginTop: 1 },
});
