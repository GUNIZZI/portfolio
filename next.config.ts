import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    cacheComponents: true,
    partialPrefetching: true,
    images: {
        // 프로젝트 썸네일을 두는 이미지 저장소(Vercel Blob)다. 앞에 저장소의 id 가 붙는다.
        // (src/entities/project/model/project.constants.ts 의 PROJECT_IMAGE_HOST_SUFFIX)
        remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
    },
    turbopack: {
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/turbopack'],
                as: '*.css',
            },
        },
    },
};

export default nextConfig;
