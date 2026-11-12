import type { Metadata } from 'next';

export const metadata: Metadata = { title: '작업 수정' };

export default function AdminProjectEditPage() {
    return (
        <main className="mx-auto max-w-page px-gutter py-10">
            <h1 className="text-section font-bold text-strong">작업 수정</h1>
        </main>
    );
}
