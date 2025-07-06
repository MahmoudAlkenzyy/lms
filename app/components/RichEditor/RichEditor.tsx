import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import { GoItalic } from "react-icons/go";
import { RiBold } from "react-icons/ri";
import { CiTextAlignJustify, CiTextAlignLeft, CiTextAlignRight } from "react-icons/ci";
import { useFormContext } from "react-hook-form";

interface RichEditorProps {
  label?: string;
  id?: string;
  name: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  label,
  placeholder = "Enter your course description...",
  id,
  name,
  rows = 4,
  disabled = false,
}) => {
  const minHeight = `${rows * 24}px`;
  const { register, setValue, getValues, watch } = useFormContext();

  const currentValue = watch(name) ?? getValues(name) ?? "";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2] } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
    ],
    content: currentValue,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const isEmpty = editor.isEmpty || html === "<p></p>";

      setValue(name, isEmpty ? "" : html, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
  });

  useEffect(() => {
    register(name);
  }, [register, name]);

  useEffect(() => {
    if (editor && currentValue !== editor.getHTML()) {
      editor.commands.setContent(currentValue || "");
    }
  }, [currentValue, editor]);

  return (
    <div className="mt-4">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
        </label>
      )}

      <div className={`border border-gray-300 rounded shadow-sm p-3 ${disabled ? "bg-gray-100" : "bg-white"}`}>
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-2 border-b border-gray-300 text-[#0000008C] pb-2">
          {[
            { icon: <CiTextAlignLeft />, action: () => editor?.chain().focus().setTextAlign("left").run() },
            { icon: <CiTextAlignJustify />, action: () => editor?.chain().focus().setTextAlign("center").run() },
            { icon: <CiTextAlignRight />, action: () => editor?.chain().focus().setTextAlign("right").run() },
            { icon: <RiBold />, action: () => editor?.chain().focus().toggleBold().run() },
            { icon: <GoItalic />, action: () => editor?.chain().focus().toggleItalic().run() },
            { icon: <u>U</u>, action: () => editor?.chain().focus().toggleUnderline().run() },
            // { icon: <>Normal</>, action: () => editor?.chain().focus().setParagraph().run() },
            // { icon: <>H2</>, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
          ].map((btn, i) => (
            <button
              key={i}
              type="button"
              onClick={disabled ? undefined : btn.action}
              className={`btn ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Editor content */}
        <EditorContent
          editor={editor}
          id={id}
          aria-label={label}
          className={`w-full focus:outline-none ${disabled ? "pointer-events-none" : ""}`}
          style={{ minHeight }}
        />
      </div>
    </div>
  );
};
