"use client";

import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Square,
  Circle,
} from "lucide-react";

// --- Custom Resizable Image Component ---
const ResizableImage = ({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) => {
  // Use local state only for the resizing interaction, otherwise derive from props
  const [resizingWidth, setResizingWidth] = useState<string | null>(null);

  const currentWidth = resizingWidth || node.attrs.width || "100%";

  const onResizeStart = useCallback(
    (e: React.MouseEvent, direction: "left" | "right") => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidthVal =
        parseInt(currentWidth.toString().replace("%", "").replace("px", "")) ||
        100;

      let currentDragWidth = startWidthVal;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startX;
        const step = direction === "right" ? 1 : -1;
        const percentChange = (diff / 800) * 100 * step;

        let newWidth = startWidthVal + percentChange;
        newWidth = Math.max(10, Math.min(100, newWidth));

        currentDragWidth = newWidth;
        setResizingWidth(`${Math.round(newWidth)}%`);
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        setResizingWidth(null); // Clear resizing state
        updateAttributes({ width: `${Math.round(currentDragWidth)}%` }); // Check in final
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [currentWidth, updateAttributes]
  );

  const setFloat = (
    e: React.MouseEvent,
    floatValue: "left" | "right" | "none"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    let newWidth = currentWidth;
    if (
      floatValue !== "none" &&
      (currentWidth === "100%" || currentWidth === "100")
    ) {
      newWidth = "50%";
    }

    updateAttributes({
      float: floatValue,
      width: newWidth,
    });
  };

  const cycleRadius = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const current = node.attrs.borderRadius || "0.5rem";
    let next = "0.5rem";

    if (current === "0px" || current === "0") next = "0.5rem";
    else if (current === "0.5rem") next = "1rem";
    else if (current === "1rem") next = "9999px";
    else if (current === "9999px") next = "0px";

    updateAttributes({ borderRadius: next });
  };

  const currentFloat = node.attrs.float || "none";
  const currentRadius = node.attrs.borderRadius || "0.5rem";

  let floatClasses = "block mx-auto my-4";
  if (currentFloat === "left") floatClasses = "float-left mr-4 mb-2";
  if (currentFloat === "right") floatClasses = "float-right ml-4 mb-2";

  return (
    <NodeViewWrapper
      as="span"
      className={`relative transition-all ${floatClasses}`}
      style={{
        width: currentWidth,
        display: currentFloat === "none" ? "block" : "inline-block",
        clear: currentFloat === "none" ? "both" : "none",
      }}
    >
      <div
        className={`relative group ${selected ? "ring-2 ring-orange-500" : ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          className={`transition-all w-full`}
          style={{ borderRadius: currentRadius }}
        />

        {selected && (
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-md flex overflow-hidden border border-gray-200 dark:border-gray-600 z-50"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentFloat === "left"
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-600"
              }`}
              onClick={(e) => setFloat(e, "left")}
              title="Float Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentFloat === "none"
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-600"
              }`}
              onClick={(e) => setFloat(e, "none")}
              title="Center"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentFloat === "right"
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-600"
              }`}
              onClick={(e) => setFloat(e, "right")}
              title="Float Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <div className="w-px bg-gray-200 dark:bg-gray-600 mx-1 self-center h-4"></div>
            <button
              type="button"
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600`}
              onClick={(e) => cycleRadius(e)}
              title="Toggle Border Radius"
            >
              {/* Visual feedback for radius */}
              {currentRadius === "0px" || currentRadius === "0" ? (
                <Square className="w-4 h-4" />
              ) : currentRadius === "9999px" ? (
                <Circle className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4 border-2 border-current rounded-md"></div>
              )}
            </button>
          </div>
        )}

        {/* Resize Handle */}
        <div
          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
          onMouseDown={(e) => onResizeStart(e, "right")}
        >
          <div className="w-1.5 h-8 bg-white/90 rounded-full shadow-md border border-gray-200"></div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

// --- Custom Image Extension ---
const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => {
          const cleanWidth = (val: string | null) => {
            if (!val) return null;
            const match = val.match(/^(\d+(?:%|px)?)/);
            return match ? match[1] : null;
          };
          let width = cleanWidth(element.style.width);
          if (width) return width;
          const styleString = element.getAttribute("style");
          if (styleString) {
            const match = /width\s*:\s*([^;!]+)/i.exec(styleString);
            if (match) {
              width = cleanWidth(match[1].trim());
              if (width) return width;
            }
          }
          width = cleanWidth(element.getAttribute("width"));
          if (width) return width;
          return "100%";
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
            style: `width: ${attributes.width} !important; height: auto !important;`,
          };
        },
      },
      float: {
        default: "none",
        parseHTML: (element) =>
          element.style.float || element.getAttribute("data-float") || "none",
        renderHTML: (attributes) => {
          const floatStyle =
            attributes.float === "left"
              ? "float: left; margin-right: 1em;"
              : attributes.float === "right"
              ? "float: right; margin-left: 1em;"
              : "";
          return {
            "data-float": attributes.float,
            style: floatStyle,
          };
        },
      },
      borderRadius: {
        default: "0.5rem",
        parseHTML: (element) => element.style.borderRadius || "0.5rem",
        renderHTML: (attributes) => ({
          style: `border-radius: ${attributes.borderRadius}`,
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage, { as: "span" });
  },
});

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
}

export function Editor({
  content,
  onChange,
  onImageUpload,
  placeholder,
}: EditorProps) {
  const extensions = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list: any[] = [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      CharacterCount,
      CustomImage.configure({
        inline: true,
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class:
            "border-collapse w-full my-4 border border-gray-300 dark:border-gray-600",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ];

    if (placeholder) {
      list.push(
        Placeholder.configure({
          placeholder,
          emptyEditorClass:
            "is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 dark:before:text-gray-500 before:float-left before:pointer-events-none before:h-0",
        })
      );
    }
    return list;
  }, [placeholder]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    editorProps: {
      attributes: {
        class:
          "tiptap focus:outline-none min-h-[300px] p-4 prose dark:prose-invert max-w-none",
      },
      handlePaste: (view, event) => {
        if (!onImageUpload) return false;

        const items = Array.from(event.clipboardData?.items || []);
        const images = items.filter((item) => item.type.indexOf("image") === 0);

        if (images.length === 0) return false;

        event.preventDefault();

        const uploadPromises = images.map((item) => {
          const file = item.getAsFile();
          if (!file) return null;

          return onImageUpload(file)
            .then((url) => {
              const { schema } = view.state;
              const node = schema.nodes.image.create({
                src: url,
                width: "100%",
              });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
            })
            .catch((err) => {
              console.error("Failed to upload image", err);
            });
        });

        Promise.all(uploadPromises).catch(console.error);

        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content with parent component
  useEffect(() => {
    if (!editor) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <ToolButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold className="w-4 h-4" />}
          title="Bold"
        />
        <ToolButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic className="w-4 h-4" />}
          title="Italic"
        />
        <ToolButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<Strikethrough className="w-4 h-4" />}
          title="Strikethrough"
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <ToolButton
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          icon={<Heading1 className="w-4 h-4" />}
          title="H1"
        />
        <ToolButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          icon={<Heading2 className="w-4 h-4" />}
          title="H2"
        />
        <ToolButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          icon={<Heading3 className="w-4 h-4" />}
          title="H3"
        />
        <ToolButton
          active={editor.isActive("heading", { level: 4 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          icon={<Heading4 className="w-4 h-4" />}
          title="H4"
        />
        <ToolButton
          active={editor.isActive("heading", { level: 5 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          icon={<Heading5 className="w-4 h-4" />}
          title="H5"
        />
        <ToolButton
          active={editor.isActive("heading", { level: 6 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          icon={<Heading6 className="w-4 h-4" />}
          title="H6"
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <ToolButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List className="w-4 h-4" />}
          title="Bullet List"
        />
        <ToolButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<ListOrdered className="w-4 h-4" />}
          title="Ordered List"
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <ToolButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<AlignLeft className="w-4 h-4" />}
          title="Align Left"
        />
        <ToolButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<AlignCenter className="w-4 h-4" />}
          title="Align Center"
        />
        <ToolButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={<AlignRight className="w-4 h-4" />}
          title="Align Right"
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<Undo className="w-4 h-4" />}
          title="Undo"
        />
        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<Redo className="w-4 h-4" />}
          title="Redo"
        />
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Footer / Char count */}
      <div className="border-t border-gray-300 dark:border-gray-600 p-2 text-xs text-gray-500 dark:text-gray-400 flex justify-end">
        {editor.storage.characterCount.characters()} characters
      </div>
    </div>
  );
}

function ToolButton({
  onClick,
  icon,
  title,
  active = false,
  disabled = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-md transition-colors
        ${
          active
            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {icon}
    </button>
  );
}
