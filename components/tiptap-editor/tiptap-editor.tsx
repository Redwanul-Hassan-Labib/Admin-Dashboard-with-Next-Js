'use client';

import { cn } from '@/lib/utils';
import Blockquote from '@tiptap/extension-blockquote';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './editor-menu-bar';

type EditorProps = {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  className?: string;
};

export default function TiptapEditor({ content, onChange, editable = true, className }: EditorProps) {
  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 pl-4 italic',
        },
      }),
      HorizontalRule,
      HardBreak,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(className),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <>
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
}
