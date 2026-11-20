import type { Metadata } from 'next';

export const metadata: Metadata = { title: '찾을 수 없음' };

/**
 * 관리 화면에서 없는 항목을 열었을 때 보이는 화면. 관리 화면의 머리 아래에 그려진다.
 * 루트의 `app/not-found.tsx` 는 공개 화면의 헤더까지 그려, 여기에 따로 두지 않으면 머리가 둘이 된다
 */
export default function AdminNotFound() {
    return (
        <main className="mx-auto max-w-page px-gutter py-10">
            <h1 className="text-section font-bold text-strong">찾을 수 없음</h1>
        </main>
    );
}
