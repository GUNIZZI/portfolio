'use client';

import {
    type ComponentProps,
    createContext,
    type ReactNode,
    Suspense,
    use,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import { usePathname } from 'next/navigation';

import ConfirmDialog from './ConfirmDialog';

/** 확인 창 하나에 넘기는 값. 여닫는 상태는 ConfirmDialogProvider 가 갖는다 */
export type ConfirmDialogData = Omit<
    ComponentProps<typeof ConfirmDialog>,
    'open' | 'onOpenChange' | 'onExitComplete' | 'onCloseAutoFocus'
> & {
    /** 같은 id 의 창이 떠 있으면 다시 띄우지 않는다. 없으면 만들어 붙인다 */
    id?: string;
};

interface EntryData {
    id: string;
    dialog: ConfirmDialogData;
    isOpen: boolean;
    /** 띄운 화면의 경로. 화면이 바뀌면 닫는다 */
    pathname: string;
    /** 띄울 때 포커스가 있던 요소. 닫으면 포커스를 여기로 돌려준다 */
    opener: HTMLElement | null;
}

interface ConfirmDialogContextData {
    addConfirmDialog: (dialog: ConfirmDialogData) => void;
    /** id 의 창을 닫는다. id 가 없으면 맨 위의 창을 닫는다 */
    removeConfirmDialog: (id?: string) => void;
    clearConfirmDialogs: () => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextData | null>(null);

interface OwnProps {
    children: ReactNode;
}

interface ListAttributes {
    entries: EntryData[];
    onClose: (id: string) => void;
    /** 사라지는 연출이 끝나 목록에서 지울 때 */
    onDrop: (id: string) => void;
}

/** 떠 있는 확인 창들. 띄운 화면과 지금 화면의 경로가 다르면 닫는다 */
function ConfirmDialogList({ entries, onClose, onDrop }: ListAttributes) {
    const pathname = usePathname();

    return entries.map(({ id, dialog, isOpen, pathname: openedPathname, opener }) => (
        <ConfirmDialog
            key={id}
            {...dialog}
            open={isOpen && openedPathname === pathname}
            onOpenChange={(isNextOpen) => {
                if (!isNextOpen) onClose(id);
            }}
            onExitComplete={() => {
                onDrop(id);
            }}
            onCloseAutoFocus={(event) => {
                // 여는 버튼이 Radix 의 Trigger 가 아니라, 포커스를 직접 돌려준다
                event.preventDefault();
                if (opener?.isConnected) opener.focus();
            }}
        />
    ));
}

/**
 * 확인 창을 그리는 곳. 안쪽 어디서든 useConfirmDialog 의 addConfirmDialog 로 띄운다.
 * 호출 방식은 Kozipsa 의 useConfirmDialog 와 같다. 스토어 대신 context 로 만들었다.
 *
 * - 연달아 부르면 나중 것이 위에 뜬다. 같은 id 는 한 번만 뜬다
 * - 닫아도 사라지는 연출이 끝날 때까지 목록에 남긴다. 연출 도중에 내용이 없어지지 않는다
 * - 화면(경로)이 바뀌면 떠 있던 창을 닫는다. onConfirm 이 물고 있던 화면이 사라졌기 때문이다
 */
export function ConfirmDialogProvider({ children }: OwnProps) {
    const [entries, setEntries] = useState<EntryData[]>([]);
    const sequenceRef = useRef(0);

    const closeEntry = useCallback((id: string) => {
        setEntries((prev) =>
            prev.map((entry) => (entry.id === id ? { ...entry, isOpen: false } : entry)),
        );
    }, []);

    const dropEntry = useCallback((id: string) => {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
    }, []);

    const context = useMemo<ConfirmDialogContextData>(
        () => ({
            addConfirmDialog(dialog) {
                sequenceRef.current += 1;
                const id = dialog.id ?? `confirm-${sequenceRef.current}`;
                const opener =
                    document.activeElement instanceof HTMLElement ? document.activeElement : null;

                setEntries((prev) =>
                    prev.some((entry) => entry.id === id)
                        ? prev
                        : [
                              ...prev,
                              {
                                  id,
                                  dialog,
                                  isOpen: true,
                                  pathname: window.location.pathname,
                                  opener,
                              },
                          ],
                );
            },
            removeConfirmDialog(id) {
                setEntries((prev) => {
                    const targetId = id ?? prev.findLast((entry) => entry.isOpen)?.id;
                    return prev.map((entry) =>
                        entry.id === targetId ? { ...entry, isOpen: false } : entry,
                    );
                });
            },
            clearConfirmDialogs() {
                setEntries((prev) => prev.map((entry) => ({ ...entry, isOpen: false })));
            },
        }),
        [],
    );

    return (
        <ConfirmDialogContext value={context}>
            {children}
            {/* 지금 주소를 읽는다. 화면을 미리 그리는 것이 막히지 않게 Suspense 안에 둔다 */}
            <Suspense fallback={null}>
                <ConfirmDialogList entries={entries} onClose={closeEntry} onDrop={dropEntry} />
            </Suspense>
        </ConfirmDialogContext>
    );
}

export function useConfirmDialog(): ConfirmDialogContextData {
    const context = use(ConfirmDialogContext);
    if (!context) {
        throw new Error('useConfirmDialog 는 ConfirmDialogProvider 안에서만 쓴다');
    }
    return context;
}
