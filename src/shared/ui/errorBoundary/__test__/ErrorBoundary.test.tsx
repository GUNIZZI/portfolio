import { render, screen } from '@testing-library/react';

import ErrorBoundary from '../ErrorBoundary';

function Broken(): never {
    throw new Error('그리다 난 에러');
}

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // React 가 경계에 잡힌 에러를 콘솔에 적는다. 테스트 출력을 어지럽히지 않게 막는다
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('에러가 없으면 감싼 내용을 그대로 그린다', () => {
        render(
            <ErrorBoundary>
                <p>본문</p>
            </ErrorBoundary>,
        );

        expect(screen.getByText('본문')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('감싼 부분에서 에러가 나면 그 자리에만 대신 칸을 그리고, 바깥은 그대로 둔다', () => {
        render(
            <>
                <p>바깥</p>
                <ErrorBoundary message="프로젝트를 불러오지 못했어요.">
                    <Broken />
                </ErrorBoundary>
            </>,
        );

        expect(screen.getByText('바깥')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('프로젝트를 불러오지 못했어요.');
        expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
    });

    it('문구를 주지 않으면 기본 문구를 쓴다', () => {
        render(
            <ErrorBoundary>
                <Broken />
            </ErrorBoundary>,
        );

        expect(screen.getByRole('alert')).toHaveTextContent('이 부분을 불러오지 못했어요.');
    });

    it('className 은 대신 칸을 놓는 바깥 자리에 준다', () => {
        render(
            <ErrorBoundary className="mx-auto max-w-page">
                <Broken />
            </ErrorBoundary>,
        );

        expect(screen.getByRole('alert').parentElement).toHaveClass('mx-auto', 'max-w-page');
    });
});
