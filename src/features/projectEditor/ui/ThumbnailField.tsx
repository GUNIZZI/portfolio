'use client';

import { type ChangeEvent, type DragEvent, useId, useRef, useState } from 'react';
import Image from 'next/image';

import { ImageUp, Trash2 } from 'lucide-react';

import { PROJECT_IMAGE } from '@/entities/project/model/project.constants';
import { Button } from '@/shared/ui/button/button';
import { FieldError } from '@/shared/ui/field/field';
import { cn } from '@/shared/util/cn';

import type { UploadedImage } from '../model/projectEditor.types';

interface OwnProps {
    /** 지금 썸네일. 없으면 null */
    image: UploadedImage | null;
    isUploading: boolean;
    /** 파일이 제한에 맞지 않거나 올리지 못했을 때의 문구 */
    error: string | null;
    /** 파일을 골랐다. 검사하고 올리는 일은 폼이 한다 */
    onSelect: (file: File) => void;
    onRemove: () => void;
}

/** 주소의 마지막 마디를 파일 이름으로 보여 준다 */
function toFileName(src: string): string {
    return decodeURIComponent(src.split('/').pop() ?? '');
}

/**
 * 썸네일 입력. 파일을 고르거나 끌어다 놓으면 바로 올리고, 올린 뒤에는 미리보기 · 파일 이름 · 크기를 보여 준다.
 * 썸네일은 1장이다. 다시 고르면 앞의 것을 바꾼다.(docs/plan/admin/wireframe.html S-02)
 */
export default function ThumbnailField({
    image,
    isUploading,
    error,
    onSelect,
    onRemove,
}: OwnProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const errorId = useId();

    function hndlChange(event: ChangeEvent<HTMLInputElement>) {
        const [file] = event.target.files ?? [];
        // 같은 파일을 다시 골라도 change 가 오게 비운다
        event.target.value = '';
        if (file) onSelect(file);
    }

    function hndlDragOver(event: DragEvent<HTMLDivElement>) {
        // 놓을 수 있는 곳임을 알린다. 막지 않으면 drop 이 오지 않는다
        event.preventDefault();
        setIsDragOver(true);
    }

    function hndlDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragOver(false);
        const [file] = event.dataTransfer.files;
        if (file && !isUploading) onSelect(file);
    }

    function hndlPick() {
        inputRef.current?.click();
    }

    return (
        <div className="flex flex-col gap-2">
            <input
                ref={inputRef}
                type="file"
                accept={PROJECT_IMAGE.CONTENT_TYPES.join(',')}
                hidden
                onChange={hndlChange}
            />
            <div
                onDragOver={hndlDragOver}
                onDragLeave={() => {
                    setIsDragOver(false);
                }}
                onDrop={hndlDrop}
                className={cn(
                    // 배치와 모양
                    'flex flex-wrap items-center gap-4 rounded-xl border border-dashed p-4',
                    // 상태. 파일을 끌어 올리면 테두리로 알린다
                    isDragOver ? 'border-primary bg-primary/10' : 'border-border-card bg-card',
                )}
            >
                {image ? (
                    <>
                        <Image
                            src={image.src}
                            alt=""
                            width={image.width}
                            height={image.height}
                            sizes="160px"
                            className="aspect-[2/1] w-40 rounded-md object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <b className="truncate text-sm text-strong">{toFileName(image.src)}</b>
                            <span className="text-caption text-muted-foreground tabular-nums">
                                {image.width}×{image.height}
                            </span>
                        </div>
                    </>
                ) : (
                    <p className="flex-1 text-caption text-muted-foreground">
                        이미지 파일을 선택하거나 이곳에 끌어다 놓으세요.
                        <br />
                        PNG · JPG · WebP (최대 5MB)
                    </p>
                )}
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="xs"
                        isLoading={isUploading}
                        aria-describedby={error ? errorId : undefined}
                        onClick={hndlPick}
                        className="items-center gap-1.5"
                    >
                        <ImageUp aria-hidden="true" />
                        {image ? '대표 이미지 바꾸기' : '대표 이미지 올리기'}
                    </Button>
                    {image ? (
                        <Button
                            variant="destructive"
                            size="xs"
                            aria-label="대표 이미지 삭제"
                            disabled={isUploading}
                            onClick={onRemove}
                            className="flex w-6.5 items-center justify-center p-0"
                        >
                            <Trash2 aria-hidden="true" />
                        </Button>
                    ) : null}
                </div>
            </div>
            <FieldError id={errorId}>{error}</FieldError>
        </div>
    );
}
