import type { Metadata } from 'next';

export const metadata: Metadata = { title: '작업 등록' };

export default function AdminProjectNewPage() {
  return (
    <main className="mx-auto max-w-page px-gutter py-10">
      <h1 className="text-section font-bold text-strong">작업 등록</h1>
    </main>
  );
}
