'use client';

import '../tiptapViewer/tiptapContent.css';

import {
    type ChangeEvent,
    type KeyboardEvent,
    type ReactNode,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';

import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import { type Editor, EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code,
    Heading2,
    Heading3,
    ImagePlus,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    SquareCode,
    Strikethrough,
    Table as TableIcon,
} from 'lucide-react';

import { cn } from '@/shared/util/cn';

import { Button } from '../button/button';
import { Input } from '../input/input';
import { Separator } from '../separator/separator';

/** 본문에 넣을 이미지 1장. 올린 뒤의 주소와 크기다 */
export interface TiptapImage {
    src: string;
    width: number;
    height: number;
}

/** 표를 처음 넣을 때의 크기. 첫 줄은 머리 줄이다 */
const TABLE_INITIAL = { rows: 3, cols: 3, withHeaderRow: true };

interface OwnProps {
    /** 본문의 HTML. 바깥에서 값을 바꾸면 에디터의 내용도 그 값으로 바꾼다 */
    value: string;
    /** 내용을 고칠 때마다 새 HTML 로 부른다 */
    onChange: (html: string) => void;
    onBlur?: () => void;
    /** 편집 영역의 이름. 스크린 리더가 읽는다 */
    label: string;
    /**
     * 고른 파일을 올리고 그 주소와 크기를 낸다. 넘기지 않으면 이미지 버튼을 그리지 않는다.
     * 올리지 못했으면 null 을 낸다. 이유를 알리는 일은 부르는 쪽이 한다
     */
    onImageUpload?: (file: File) => Promise<TiptapImage | null>;
    /** 파일을 고르는 창이 받는 형식. `image/png,image/jpeg` */
    imageAccept?: string;
    className?: string;
}

/** 에디터가 쓰는 서식. 제목은 h2 · h3 만 받는다. 본문의 절이 h2 다.(docs/plan/work/README.md 「상세」) */
const EXTENSIONS = [
    StarterKit.configure({
        heading: { levels: [2, 3] },
        // 쓰는 동안 링크를 눌러도 열리지 않게 한다. 주소는 도구 줄에서 넣는다
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
    }),
    // 이미지는 문단 사이에 한 줄을 차지한다. 주소는 올린 파일의 것만 넣는다
    Image.configure({ inline: false, allowBase64: false }),
    // 칸의 폭은 읽는 화면의 CSS 가 고르게 나눈다. 끌어서 폭을 바꾸지 않는다
    TableKit.configure({ table: { resizable: false } }),
];

interface ToolAttributes {
    /** 버튼의 이름. 아이콘만 있어 이름을 따로 준다 */
    label: string;
    isActive: boolean;
    onClick: () => void;
    children: ReactNode;
}

/** 도구 줄의 버튼 1개. 켜진 서식은 aria-pressed 로 알리고 글자색으로 구분한다 */
function Tool({ label, isActive, onClick, children }: ToolAttributes) {
    return (
        <Button
            variant="ghost"
            size="2xs"
            aria-label={label}
            aria-pressed={isActive}
            onClick={onClick}
            className={cn('w-7 items-center justify-center p-0', isActive && 'text-primary')}
        >
            {children}
        </Button>
    );
}

interface ToolbarAttributes {
    editor: Editor;
    onImageUpload: OwnProps['onImageUpload'];
    imageAccept: OwnProps['imageAccept'];
}

/**
 * 서식 버튼의 줄. 링크는 주소를 적는 입력을 줄 아래에 펼친다.
 * 이미지를 골랐으면 대체 텍스트 입력을, 표 안에 있으면 줄 · 칸을 고치는 버튼을 줄 아래에 펼친다
 */
function Toolbar({ editor, onImageUpload, imageAccept }: ToolbarAttributes) {
    const active = useEditorState({
        editor,
        selector: ({ editor: current }) => ({
            h2: current.isActive('heading', { level: 2 }),
            h3: current.isActive('heading', { level: 3 }),
            bold: current.isActive('bold'),
            strike: current.isActive('strike'),
            bulletList: current.isActive('bulletList'),
            orderedList: current.isActive('orderedList'),
            blockquote: current.isActive('blockquote'),
            code: current.isActive('code'),
            codeBlock: current.isActive('codeBlock'),
            link: current.isActive('link'),
            image: current.isActive('image'),
            imageAlt: current.getAttributes('image')['alt'] as unknown,
            table: current.isActive('table'),
        }),
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const altInputId = useId();
    /** 링크 주소를 적는 중이면 그 값. 입력을 닫아 두었으면 null */
    const [linkDraft, setLinkDraft] = useState<string | null>(null);
    const linkInputId = useId();

    function hndlLinkOpen() {
        const href: unknown = editor.getAttributes('link')['href'];
        setLinkDraft(typeof href === 'string' ? href : '');
    }

    function hndlLinkApply() {
        const href = (linkDraft ?? '').trim();
        const chain = editor.chain().focus().extendMarkRange('link');
        // 주소를 비우고 적용하면 링크를 푼다
        if (href === '') {
            chain.unsetLink().run();
        } else {
            chain.setLink({ href }).run();
        }
        setLinkDraft(null);
    }

    function hndlLinkKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Escape') {
            event.preventDefault();
            setLinkDraft(null);
            editor.commands.focus();
            return;
        }
        // 한글 조합 중의 Enter 는 글자를 확정하는 것이라 넘긴다
        if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
        // 폼이 제출되지 않게 막는다
        event.preventDefault();
        hndlLinkApply();
    }

    async function hndlImageChange(event: ChangeEvent<HTMLInputElement>) {
        const [file] = event.target.files ?? [];
        // 같은 파일을 다시 골라도 change 가 오게 비운다
        event.target.value = '';
        if (!file || !onImageUpload) return;

        setIsUploading(true);
        try {
            const image = await onImageUpload(file);
            if (image) {
                editor.chain().focus().setImage(image).run();
            }
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="border-b border-input">
            <div role="toolbar" aria-label="서식" className="flex flex-wrap items-center gap-1 p-2">
                <Tool
                    label="제목 2"
                    isActive={active.h2}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 aria-hidden="true" />
                </Tool>
                <Tool
                    label="제목 3"
                    isActive={active.h3}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 aria-hidden="true" />
                </Tool>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <Tool
                    label="굵게"
                    isActive={active.bold}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold aria-hidden="true" />
                </Tool>
                <Tool
                    label="취소선"
                    isActive={active.strike}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough aria-hidden="true" />
                </Tool>
                <Tool
                    label="코드"
                    isActive={active.code}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code aria-hidden="true" />
                </Tool>
                <Tool label="링크" isActive={active.link} onClick={hndlLinkOpen}>
                    <LinkIcon aria-hidden="true" />
                </Tool>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <Tool
                    label="글머리 목록"
                    isActive={active.bulletList}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List aria-hidden="true" />
                </Tool>
                <Tool
                    label="번호 목록"
                    isActive={active.orderedList}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered aria-hidden="true" />
                </Tool>
                <Tool
                    label="인용"
                    isActive={active.blockquote}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote aria-hidden="true" />
                </Tool>
                <Tool
                    label="코드 블록"
                    isActive={active.codeBlock}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <SquareCode aria-hidden="true" />
                </Tool>
                <Tool
                    label="구분선"
                    isActive={false}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus aria-hidden="true" />
                </Tool>
                <Separator orientation="vertical" className="mx-1 h-4" />
                {onImageUpload ? (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={imageAccept}
                            hidden
                            onChange={(event) => {
                                void hndlImageChange(event);
                            }}
                        />
                        <Button
                            variant="ghost"
                            size="2xs"
                            aria-label="이미지"
                            isLoading={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-7 items-center justify-center p-0"
                        >
                            <ImagePlus aria-hidden="true" />
                        </Button>
                    </>
                ) : null}
                <Tool
                    label="표"
                    isActive={active.table}
                    onClick={() => editor.chain().focus().insertTable(TABLE_INITIAL).run()}
                >
                    <TableIcon aria-hidden="true" />
                </Tool>
            </div>
            {active.image ? (
                <div className="flex items-center gap-2 px-2 pb-2">
                    <label htmlFor={altInputId} className="text-caption text-muted-foreground">
                        대체 텍스트
                    </label>
                    <Input
                        id={altInputId}
                        size="xs"
                        placeholder="이미지가 보여 주는 것"
                        value={typeof active.imageAlt === 'string' ? active.imageAlt : ''}
                        onChange={(event) => {
                            editor.commands.updateAttributes('image', { alt: event.target.value });
                        }}
                        className="max-w-80"
                    />
                </div>
            ) : null}
            {active.table ? (
                <div
                    role="toolbar"
                    aria-label="표"
                    className="flex flex-wrap items-center gap-1 px-2 pb-2"
                >
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        className="items-center"
                    >
                        줄 더하기
                    </Button>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => editor.chain().focus().deleteRow().run()}
                        className="items-center"
                    >
                        줄 지우기
                    </Button>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        className="items-center"
                    >
                        칸 더하기
                    </Button>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                        className="items-center"
                    >
                        칸 지우기
                    </Button>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                        className="items-center"
                    >
                        머리 줄
                    </Button>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        className="items-center"
                    >
                        표 지우기
                    </Button>
                </div>
            ) : null}
            {linkDraft === null ? null : (
                <div className="flex items-center gap-2 px-2 pb-2">
                    <label htmlFor={linkInputId} className="text-caption text-muted-foreground">
                        주소
                    </label>
                    <Input
                        id={linkInputId}
                        size="xs"
                        // 링크 버튼을 누른 사람이 바로 주소를 적게 한다
                        autoFocus
                        placeholder="https://"
                        value={linkDraft}
                        onChange={(event) => {
                            setLinkDraft(event.target.value);
                        }}
                        onKeyDown={hndlLinkKeyDown}
                        className="max-w-80"
                    />
                    <Button size="xs" onClick={hndlLinkApply} className="items-center">
                        적용
                    </Button>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                            setLinkDraft(null);
                        }}
                        className="items-center"
                    >
                        닫기
                    </Button>
                </div>
            )}
        </div>
    );
}

/**
 * Tiptap 으로 본문을 쓰는 에디터. 내는 값은 HTML 이다.
 * 편집 영역은 읽는 화면(TiptapViewer)과 같은 서식 클래스를 달아, 쓰면서 보던 모습 그대로 읽힌다.
 * 서식은 제목(h2 · h3) · 굵게 · 취소선 · 코드 · 링크 · 목록 · 인용 · 코드 블록 · 구분선 · 이미지 · 표다.
 * (docs/plan/admin/README.md 「등록 · 수정」, 이미지와 표는 2026-11-20 사용자 결정)
 */
export default function TiptapEditor({
    value,
    onChange,
    onBlur,
    label,
    onImageUpload,
    imageAccept,
    className,
}: OwnProps) {
    const editor = useEditor({
        extensions: EXTENSIONS,
        content: value,
        // 서버에서는 그리지 않는다. 서버와 브라우저가 그린 HTML 이 어긋나지 않게 한다
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'tiptap-content min-h-60 p-4 outline-none',
                role: 'textbox',
                'aria-multiline': 'true',
                'aria-label': label,
            },
        },
        onUpdate: ({ editor: current }) => {
            onChange(current.getHTML());
        },
        onBlur,
    });

    // 바깥에서 값을 바꾸면(폼을 처음 값으로 되돌릴 때) 에디터의 내용도 맞춘다. 에디터가 낸 값이면 건드리지 않는다
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [editor, value]);

    return (
        <div
            className={cn(
                // 배치와 모양. 입력과 같은 테두리와 바탕이다
                'rounded-card border border-input bg-card',
                // 포커스. 편집 영역에 포커스가 있으면 테두리로 알린다
                'focus-within:border-primary',
                className,
            )}
        >
            {editor ? (
                <Toolbar editor={editor} onImageUpload={onImageUpload} imageAccept={imageAccept} />
            ) : null}
            <EditorContent editor={editor} />
        </div>
    );
}
