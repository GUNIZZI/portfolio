import type { Metadata } from 'next';

export const metadata: Metadata = { title: '작업 관리' };

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-page px-gutter py-10">
      <h1 className="text-section font-bold text-strong">작업 관리</h1>
    </main>
  );
}
