'use client';

import { useState } from 'react';

import { upload } from '@vercel/blob/client';

import { PROJECT_FIELD_ERROR } from '@/entities/project/model/project.constants';

import { IMAGE_UPLOAD_URL } from './projectEditor.constants';
import type { UploadedImage } from './projectEditor.types';
import { toImageFileError, toImagePathname, toResizedSize } from './projectEditor.utils';

interface ResizedImage {
    blob: Blob;
    width: number;
    height: number;
}

/**
 * 이미지를 긴 변 1000px 이하로 줄이고 WebP 로 바꾼다.(docs/plan/admin/README.md 요구사항 31)
 * 제한보다 작은 이미지는 크기를 그대로 두고 형식만 바꾼다.
 * WebP 로 바꾸지 못하는 브라우저(Safari)는 PNG 를 낸다. 형식은 낸 파일에서 읽는다
 * @throws 이미지로 읽지 못하거나 그리지 못할 때
 */
async function resizeImage(file: File): Promise<ResizedImage> {
    const bitmap = await createImageBitmap(file);
    const { width, height } = toResizedSize(bitmap.width, bitmap.height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
        bitmap.close();
        throw new Error('캔버스를 만들지 못했다');
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/webp');
    });
    if (!blob) {
        throw new Error('이미지를 바꾸지 못했다');
    }
    return { blob, width, height };
}

interface ImageUpload {
    /** 올리는 중인가 */
    isUploading: boolean;
    /** 고른 파일이 제한에 맞지 않거나 올리지 못했을 때의 문구. 없으면 null */
    error: string | null;
    /**
     * 파일을 검사하고, 크기를 줄여 이미지 저장소에 올린다
     * @returns 올린 파일. 제한에 맞지 않거나 올리지 못했으면 null 이고, 이유는 error 에 남는다
     */
    uploadImage: (file: File) => Promise<UploadedImage | null>;
    /** 오류 문구를 지운다. 썸네일을 지웠을 때 부른다 */
    clearError: () => void;
}

/**
 * 썸네일 1장을 이미지 저장소에 올린다. 브라우저가 저장소에 바로 올리고, 서버는 올릴 권한만 내준다.
 * 올리기 전에 크기를 줄인다. 저장하는 가로 · 세로는 줄인 뒤의 값이다.(docs/plan/admin/README.md 「등록 · 수정」)
 */
export function useImageUpload(): ImageUpload {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function uploadImage(file: File): Promise<UploadedImage | null> {
        const fileError = toImageFileError(file);
        if (fileError) {
            setError(fileError);
            return null;
        }

        setError(null);
        setIsUploading(true);
        try {
            const resized = await resizeImage(file);
            const uploaded = await upload(
                toImagePathname(file.name, resized.blob.type),
                resized.blob,
                {
                    access: 'public',
                    handleUploadUrl: IMAGE_UPLOAD_URL,
                    contentType: resized.blob.type,
                },
            );
            return { src: uploaded.url, width: resized.width, height: resized.height };
        } catch (uploadError) {
            console.error(uploadError);
            setError(PROJECT_FIELD_ERROR.IMAGE_UPLOAD);
            return null;
        } finally {
            setIsUploading(false);
        }
    }

    return {
        isUploading,
        error,
        uploadImage,
        clearError: () => {
            setError(null);
        },
    };
}
