import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline as UnderlineIcon,
} from "lucide-react";
import PropTypes from "prop-types";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-200 rounded-t-xl bg-gray-50 p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("bold") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("italic") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("underline") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("strike") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("code") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Inline Code"
      >
        <Code className="w-5 h-5" />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("heading", { level: 1 }) ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("heading", { level: 2 }) ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-5 h-5" />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("bulletList") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Bullet List"
      >
        <List className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("orderedList") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("blockquote") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Blockquote"
      >
        <Quote className="w-5 h-5" />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive({ textAlign: "left" }) ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Align Left"
      >
        <AlignLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive({ textAlign: "center" }) ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Align Center"
      >
        <AlignCenter className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive({ textAlign: "right" }) ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Align Right"
      >
        <AlignRight className="w-5 h-5" />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Link & Image */}
      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
          editor.isActive("link") ? "bg-primary/20 text-primary" : "text-gray-700"
        }`}
        title="Add Link"
      >
        <LinkIcon className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={addImage}
        className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-700"
        title="Add Image"
      >
        <ImageIcon className="w-5 h-5" />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Undo/Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-700 disabled:opacity-30"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-700 disabled:opacity-30"
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.object,
};

const RichTextEditor = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholder || "Start writing your amazing content...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer hover:text-primary-light",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4",
      },
    },
  });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="rich-text-editor"
      />
    </div>
  );
};

RichTextEditor.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default RichTextEditor;
