import './tiptapContent.css';

import { cn } from '@/shared/util/cn';

interface OwnProps {
    /** 보여 줄 HTML. Tiptap 에디터가 내는 값이다 */
    content: string;
    /** 바깥 요소에 붙는다. 여백과 폭은 여기서 정한다 */
    className?: string;
}

/**
 * Tiptap 으로 작성한 본문을 읽는 화면. Kozipsa 의 TiptapViewer 와 같은 역할이다.
 *
 * 서버에서 그린다. 작업 상세는 검색에 잡혀야 하는 화면이라 본문이 처음부터 HTML 에 들어 있어야 한다.
 * Kozipsa 는 브라우저에서 정제(DOMPurify)한 뒤에 채우는데, 그 방식은 첫 HTML 이 비어 검색에 잡히지 않는다.
 *
 * 그래서 이 컴포넌트는 정제하지 않는다. 믿을 수 있는 HTML 만 넘긴다.
 * 프로젝트의 본문은 관리 화면에서 받아, 저장할 때 서버가 정제한다.
 * (src/entities/project/services/project.services.ts 의 sanitizeProjectBody)
 */
export default function TiptapViewer({ content, className }: OwnProps) {
    if (!content) return null;

    return (
        <div
            className={cn('tiptap-content', className)}
            // 본문은 Tiptap 이 내는 HTML 이다. 믿을 수 있는 값만 받는다(위 설명)
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
