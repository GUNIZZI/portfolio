import type { Metadata } from 'next';

export const metadata: Metadata = { title: '소개' };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-page px-gutter py-10">
      <h1 className="text-section font-bold text-strong">소개</h1>
    </main>
  );
}
