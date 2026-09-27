import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	BoldIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	ItalicIcon,
	ListIcon,
	ListOrderedIcon,
	Redo2Icon,
	StrikethroughIcon,
	TypeIcon,
	UnderlineIcon,
	Undo2Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

const extensions = [TextStyleKit, StarterKit];

function MenuBar({ editor, className }: { editor: Editor; className?: string }) {
	const editorState = useEditorState({
		editor,
		selector: (ctx) => {
			return {
				isBold: ctx.editor.isActive("bold") ?? false,
				canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
				isItalic: ctx.editor.isActive("italic") ?? false,
				canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
				isStrike: ctx.editor.isActive("strike") ?? false,
				canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
				isUnderline: ctx.editor.isActive("underline") ?? false,
				canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
				isParagraph: ctx.editor.isActive("paragraph") ?? false,
				isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
				isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
				isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
				isBulletList: ctx.editor.isActive("bulletList") ?? false,
				isOrderedList: ctx.editor.isActive("orderedList") ?? false,
				canUndo: ctx.editor.can().chain().undo().run() ?? false,
				canRedo: ctx.editor.can().chain().redo().run() ?? false,
			};
		},
	});

	const currentBlock = editorState.isHeading1
		? "h1"
		: editorState.isHeading2
			? "h2"
			: editorState.isHeading3
				? "h3"
				: editorState.isBulletList
					? "bullet-list"
					: editorState.isOrderedList
						? "number-list"
						: "p";

	return (
		<div className={cn("flex items-center gap-2 border-b", className)}>
			<ButtonGroup>
				<Button
					size="icon-sm"
					variant="outline"
					aria-label="Undo"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editorState.canUndo}
				>
					<Undo2Icon />
				</Button>
				<Button
					size="icon-sm"
					variant="outline"
					aria-label="Redo"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editorState.canRedo}
				>
					<Redo2Icon />
				</Button>
			</ButtonGroup>

			<Select
				value={currentBlock}
				onValueChange={(value) => {
					value === "p" && editor.chain().focus().setParagraph().run();
					value === "h1" && editor.chain().focus().setHeading({ level: 1 }).run();
					value === "h2" && editor.chain().focus().setHeading({ level: 2 }).run();
					value === "h3" && editor.chain().focus().setHeading({ level: 3 }).run();
					value === "bullet-list" && editor.chain().focus().toggleBulletList().run();
					value === "number-list" && editor.chain().focus().toggleOrderedList().run();
				}}
			>
				<SelectTrigger className="min-w-40" size="sm" aria-label="Text block format">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="h1">
						<Heading1Icon />
						Heading 1
					</SelectItem>
					<SelectItem value="h2">
						<Heading2Icon />
						Heading 2
					</SelectItem>
					<SelectItem value="h3">
						<Heading3Icon />
						Heading 3
					</SelectItem>
					<SelectItem value="p">
						<TypeIcon />
						Paragraph
					</SelectItem>
					<SelectItem value="bullet-list">
						<ListIcon />
						Bullet List
					</SelectItem>
					<SelectItem value="number-list">
						<ListOrderedIcon />
						Number List
					</SelectItem>
				</SelectContent>
			</Select>

			<ButtonGroup>
				<Toggle
					size="sm"
					variant="outline"
					aria-label="Bold"
					pressed={editorState.isBold}
					onPressedChange={() => editor.chain().focus().toggleBold().run()}
					disabled={!editorState.canBold}
				>
					<BoldIcon />
				</Toggle>
				<Toggle
					size="sm"
					variant="outline"
					aria-label="Italic"
					pressed={editorState.isItalic}
					onPressedChange={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editorState.canItalic}
				>
					<ItalicIcon />
				</Toggle>
				<Toggle
					size="sm"
					variant="outline"
					aria-label="Underline"
					pressed={editorState.isUnderline}
					onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
					disabled={!editorState.canUnderline}
				>
					<UnderlineIcon />
				</Toggle>
				<Toggle
					size="sm"
					variant="outline"
					aria-label="Strikethrough"
					pressed={editorState.isStrike}
					onPressedChange={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editorState.canStrike}
				>
					<StrikethroughIcon />
				</Toggle>
			</ButtonGroup>
		</div>
	);
}

export function TextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
	const editor = useEditor({
		extensions,
		content: value,
		immediatelyRender: false,
		onUpdate: ({ editor }) => onChange(editor.getHTML()),
		editorProps: { attributes: { class: "px-3 py-2 min-h-80 text-sm" } },
	});
	return (
		<div className="overflow-hidden rounded-lg border shadow-xs">
			{editor && <MenuBar editor={editor} className="px-3 py-2" />}
			<EditorContent
				editor={editor}
				className={cn(
					"**:[h1]:text-xl **:[h1]:font-semibold **:[h2]:text-lg **:[h2]:font-semibold **:[h3]:text-base **:[h3]:font-semibold",
					"**:[ol]:list-inside **:[ol]:list-decimal **:[ul]:list-inside **:[ul]:list-disc",
					"**:[li>p]:inline",
				)}
			/>
		</div>
	);
}
