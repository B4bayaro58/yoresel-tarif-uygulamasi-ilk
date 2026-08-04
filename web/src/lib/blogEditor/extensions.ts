import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { RecipeCardExtension } from './recipeCardExtension'
import { RecipeLinkExtension } from './recipeLinkExtension'

// Editör (BlogEditor, düzenlenebilir) ve herkese açık render (BlogContentRenderer,
// salt-okunur) AYNI extension setini kullanır — böylece admin panelinde görülen
// yazı ile yayındaki hali birebir eşleşir.
export const blogExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  Link.configure({ openOnClick: false, autolink: true }),
  RecipeCardExtension,
  RecipeLinkExtension,
]
