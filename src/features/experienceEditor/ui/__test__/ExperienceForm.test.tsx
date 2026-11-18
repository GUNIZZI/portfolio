import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createExperienceAction } from '@/entities/experience/actions/experience.actions';

import ExperienceForm from '../ExperienceForm';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/shared/ui/toast/ToastProvider', () => ({
    useToast: () => Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), warning: vi.fn() }),
}));
vi.mock('@/shared/ui/alertDialog/ConfirmDialogProvider', () => ({
    useConfirmDialog: () => ({ addConfirmDialog: vi.fn() }),
}));
vi.mock('@/entities/experience/actions/experience.actions', () => ({
    createExperienceAction: vi.fn(() => Promise.resolve('SAVED')),
    updateExperienceAction: vi.fn(() => Promise.resolve('SAVED')),
    deleteExperienceAction: vi.fn(() => Promise.resolve('SAVED')),
}));

/** 이름이 붙지 않은 입력이라 폼의 항목 이름(name)으로 찾는다 */
function getInput(name: 'company' | 'startYear' | 'endYear') {
    const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!input) throw new Error(`${name} 입력을 찾지 못했다`);
    return input;
}

describe('ExperienceForm 의 검증', () => {
    // jsdom 에 없는 것을 채운다. Radix 의 Switch 가 크기를 잴 때 부른다
    beforeAll(() => {
        vi.stubGlobal(
            'ResizeObserver',
            class {
                observe = vi.fn();
                unobserve = vi.fn();
                disconnect = vi.fn();
            },
        );
    });

    it('처음에는 오류 문구 없이 등록 버튼만 막혀 있다', () => {
        render(<ExperienceForm experience={null} projects={[]} />);

        expect(screen.getByRole('button', { name: '등록' })).toBeDisabled();
        expect(screen.queryByText('회사를 입력해 주세요.')).not.toBeInTheDocument();
    });

    it('스키마가 낸 문구를 그 항목 아래에 그린다', async () => {
        render(<ExperienceForm experience={null} projects={[]} />);

        // 지나간 빈 필수 항목
        await userEvent.click(getInput('company'));
        await userEvent.tab();
        expect(await screen.findByText('회사를 입력해 주세요.')).toBeInTheDocument();

        // 형식이 틀린 값은 적는 동안 알린다
        await userEvent.type(getInput('startYear'), '25');
        expect(await screen.findByText('연도 4자리를 입력해 주세요.')).toBeInTheDocument();
        // 손대지 않은 퇴사는 알리지 않는다
        expect(screen.getAllByText('연도 4자리를 입력해 주세요.')).toHaveLength(1);
    });

    it('퇴사가 입사보다 앞서면 알리고, 입사를 고치면 문구가 없어진다', async () => {
        render(<ExperienceForm experience={null} projects={[]} />);

        await userEvent.type(getInput('startYear'), '2025');
        await userEvent.type(getInput('endYear'), '2024');
        expect(
            await screen.findByText('퇴사날짜는 입사날짜보다 앞설 수 없습니다.'),
        ).toBeInTheDocument();

        await userEvent.clear(getInput('startYear'));
        await userEvent.type(getInput('startYear'), '2020');
        expect(
            screen.queryByText('퇴사날짜는 입사날짜보다 앞설 수 없습니다.'),
        ).not.toBeInTheDocument();
    });

    it('규칙에 맞으면 스키마가 바꾼 내용으로 등록한다', async () => {
        render(<ExperienceForm experience={null} projects={[]} />);

        await userEvent.type(getInput('company'), 'KOCOM');
        await userEvent.type(getInput('startYear'), '2025');
        await userEvent.click(screen.getByRole('switch', { name: '재직 중' }));
        await userEvent.click(screen.getByRole('button', { name: '+ 프로젝트 등록' }));
        await userEvent.type(
            screen.getByRole('textbox', { name: '1번째 프로젝트 이름' }),
            'Design System',
        );
        await userEvent.type(
            screen.getByRole('textbox', { name: '1번째 프로젝트 시기' }),
            '2025.06',
        );

        const submit = screen.getByRole('button', { name: '등록' });
        expect(submit).toBeEnabled();
        await userEvent.click(submit);

        expect(createExperienceAction).toHaveBeenCalledExactlyOnceWith({
            company: 'KOCOM',
            startYear: 2025,
            endYear: null,
            summary: '',
            projects: [{ name: 'Design System', date: '2025.06', tags: [] }],
        });
    });
});
