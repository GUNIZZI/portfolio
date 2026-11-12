import type { Metadata } from 'next';

export const metadata: Metadata = { title: '이 사이트는 이렇게' };

export default function ColophonPage() {
  return (
    <main className="mx-auto max-w-page px-gutter py-10">
      <h1 className="text-section font-bold text-strong">이 사이트는 이렇게</h1>
    </main>
  );
}
