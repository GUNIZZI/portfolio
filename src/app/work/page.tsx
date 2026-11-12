import type { Metadata } from 'next';

export const metadata: Metadata = { title: '작업' };

export default function WorkPage() {
    return (
        <main className="mx-auto max-w-page px-gutter py-10">
            <h1 className="text-section font-bold text-strong">작업</h1>
        </main>
    );
}
