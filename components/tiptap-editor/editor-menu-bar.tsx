import { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Type,
  Underline,
  Undo,
} from 'lucide-react';
import { Toggle } from '../ui/toggle';

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive('bold'),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive('italic'),
    },
    {
      icon: <Underline className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      preesed: editor.isActive('underline'),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive('strike'),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive('highlight'),
    },
    {
      icon: <LinkIcon className="size-4" />,
      onClick: () => {
        const url = window.prompt('Enter URL');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      preesed: editor.isActive('link'),
    },
    {
      icon: <Quote className="size-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      preesed: editor.isActive('blockquote'),
    },
    {
      icon: <Type className="size-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      preesed: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      preesed: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      preesed: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive('orderedList'),
    },
    {
      icon: <Undo className="size-4" />,
      onClick: () => editor.chain().focus().undo().run(),
    },
    {
      icon: <Redo className="size-4" />,
      onClick: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="dark:bg-dark-lite z-50 mb-1 space-x-2 rounded-md border bg-slate-50 p-1">
      {Options.map((option, index) => (
        <Toggle key={index} pressed={option.preesed} onPressedChange={option.onClick}>
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
