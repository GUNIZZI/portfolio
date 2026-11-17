import type { Metadata } from 'next';

// 관리 화면은 검색 색인에서 뺀다 (docs/plan/admin/README.md 「접근」)
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
    return children;
}
