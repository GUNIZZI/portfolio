import type { Metadata } from 'next';

export const metadata: Metadata = { title: '찾을 수 없음' };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-page px-gutter py-10">
      <h1 className="text-section font-bold text-strong">찾을 수 없음</h1>
    </main>
  );
}
