import type { Metadata } from 'next';

export const metadata: Metadata = { title: '로그인' };

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-page px-gutter py-10">
      <h1 className="text-section font-bold text-strong">로그인</h1>
    </main>
  );
}
