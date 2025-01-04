// src/components/EditorForm.vue
<template>
  <div class="editor-wrapper">
    <!-- Editor Menu -->
    <div class="bg-gray-50 p-2 rounded-t-lg border border-gray-300 flex flex-wrap gap-2">
      <button
        v-for="item in menuItems"
        :key="item.action"
        @click="item.action"
        :class="[
          'p-2 rounded hover:bg-gray-200 transition-colors',
          { 'bg-gray-200': item.isActive?.() },
        ]"
        type="button"
      >
        <component :is="item.icon" class="w-5 h-5" />
      </button>

      <!-- Heading Select -->
      <select
        @change="setHeading($event)"
        class="px-2 py-1 rounded border border-gray-300 bg-white"
      >
        <option value="">Normal</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
      </select>
    </div>

    <!-- Editor Content -->
    <editor-content
      :editor="editor"
      class="prose max-w-none border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-[400px]"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListOrderedIcon,
  ListIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  QuoteIcon,
} from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Start writing...',
  },
})

const emit = defineEmits(['update:modelValue'])

// Initialize editor
const editor = new Editor({
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Menu items configuration
const menuItems = [
  {
    icon: BoldIcon,
    action: () => editor.chain().focus().toggleBold().run(),
    isActive: () => editor.isActive('bold'),
  },
  {
    icon: ItalicIcon,
    action: () => editor.chain().focus().toggleItalic().run(),
    isActive: () => editor.isActive('italic'),
  },
  {
    icon: UnderlineIcon,
    action: () => editor.chain().focus().toggleUnderline().run(),
    isActive: () => editor.isActive('underline'),
  },
  {
    icon: ListIcon,
    action: () => editor.chain().focus().toggleBulletList().run(),
    isActive: () => editor.isActive('bulletList'),
  },
  {
    icon: ListOrderedIcon,
    action: () => editor.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.isActive('orderedList'),
  },
  {
    icon: QuoteIcon,
    action: () => editor.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.isActive('blockquote'),
  },
  {
    icon: AlignLeftIcon,
    action: () => editor.chain().focus().setTextAlign('left').run(),
    isActive: () => editor.isActive({ textAlign: 'left' }),
  },
  {
    icon: AlignCenterIcon,
    action: () => editor.chain().focus().setTextAlign('center').run(),
    isActive: () => editor.isActive({ textAlign: 'center' }),
  },
  {
    icon: AlignRightIcon,
    action: () => editor.chain().focus().setTextAlign('right').run(),
    isActive: () => editor.isActive({ textAlign: 'right' }),
  },
]

// Set heading level
const setHeading = (event) => {
  const level = event.target.value
  if (level) {
    editor
      .chain()
      .focus()
      .toggleHeading({ level: parseInt(level) })
      .run()
  } else {
    editor.chain().focus().setParagraph().run()
  }
}

// Watch for external value changes
watch(
  () => props.modelValue,
  (newValue) => {
    const isSame = newValue === editor.getHTML()
    if (!isSame) {
      editor.commands.setContent(newValue, false)
    }
  },
)

// Cleanup
onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style>
/* Add required styles for the editor */
.ProseMirror {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
