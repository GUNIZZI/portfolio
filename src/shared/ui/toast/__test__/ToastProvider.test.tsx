import { useEffect } from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';

import { type ToastFunction, ToastProvider, useToast } from '../ToastProvider';

let toast: ToastFunction;

function Capture() {
    const captured = useToast();
    useEffect(() => {
        toast = captured;
    }, [captured]);
    return null;
}

function renderProvider() {
    render(
        <ToastProvider>
            <Capture />
        </ToastProvider>,
    );
}

function getToasts() {
    return [...screen.getByRole('status').querySelectorAll('[data-slot="toast"]')];
}

describe('ToastProvider', () => {
    it('종류와 제목 · 설명을 그린다', () => {
        renderProvider();
        act(() => {
            toast.success('저장했습니다', { description: '목록에서 확인하세요.' });
        });

        const [item] = getToasts();
        expect(item).toHaveAttribute('data-type', 'success');
        expect(item).toHaveTextContent('저장했습니다');
        expect(item).toHaveTextContent('목록에서 확인하세요.');
    });

    it('연달아 부르면 쌓이고, 같은 id 는 그 토스트를 바꾼다', () => {
        renderProvider();
        act(() => {
            toast('복사했습니다');
            toast.loading('저장하는 중', { id: 'save' });
            toast.error('저장하지 못했습니다', { id: 'save' });
        });

        const items = getToasts();
        expect(items).toHaveLength(2);
        expect(items[1]).toHaveAttribute('data-type', 'error');
        expect(items[1]).toHaveTextContent('저장하지 못했습니다');
    });

    it('띄워 둔 시간이 지나면 지운다. 로딩은 남는다', async () => {
        renderProvider();
        act(() => {
            toast.info('새 공지', { duration: 10 });
            toast.loading('올리는 중');
        });
        expect(getToasts()).toHaveLength(2);

        await waitFor(() => {
            expect(getToasts()).toHaveLength(1);
        });
        expect(getToasts()[0]).toHaveTextContent('올리는 중');

        act(() => {
            toast.dismiss();
        });
        await waitFor(() => {
            expect(getToasts()).toHaveLength(0);
        });
    });

    it('promise 는 로딩 토스트 1장을 결과로 바꾸고, 실패한 까닭을 설명에 적는다', async () => {
        renderProvider();
        const hndlFinally = vi.fn();
        act(() => {
            toast.promise(Promise.reject(new Error('권한이 없습니다')), {
                loading: '저장하는 중',
                success: '저장했습니다',
                error: '저장하지 못했습니다',
                finally: hndlFinally,
            });
        });
        expect(getToasts()[0]).toHaveAttribute('data-type', 'loading');

        await waitFor(() => expect(getToasts()[0]).toHaveAttribute('data-type', 'error'));
        expect(getToasts()).toHaveLength(1);
        expect(getToasts()[0]).toHaveTextContent('저장하지 못했습니다');
        expect(getToasts()[0]).toHaveTextContent('권한이 없습니다');
        expect(hndlFinally).toHaveBeenCalledOnce();
    });
});
