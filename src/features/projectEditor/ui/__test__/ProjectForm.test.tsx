import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
    createProjectAction,
    updateProjectAction,
} from '@/entities/project/actions/project.actions';
import type { ProjectEditorData } from '@/entities/project/model/project.types';

import ProjectForm from '../ProjectForm';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock('@/shared/ui/toast/ToastProvider', () => ({
    useToast: () => Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), warning: vi.fn() }),
}));
vi.mock('@/shared/ui/alertDialog/ConfirmDialogProvider', () => ({
    useConfirmDialog: () => ({ addConfirmDialog: vi.fn() }),
}));
// 브라우저에서 이미지 저장소로 올리는 부분은 e2e 가 아니면 확인할 수 없다. 불러오기만 막는다
vi.mock('@vercel/blob/client', () => ({ upload: vi.fn() }));
// 에디터는 jsdom 에서 그려지지 않는다. 값이 폼에 이어지는지만 보게 글상자로 바꾼다
vi.mock('@/shared/ui/tiptapEditor/TiptapEditor', () => ({
    default: ({
        label,
        value,
        onChange,
    }: {
        label: string;
        value: string;
        onChange: (html: string) => void;
    }) => (
        <textarea
            aria-label={label}
            value={value}
            onChange={(event) => {
                onChange(event.target.value);
            }}
        />
    ),
}));
vi.mock('@/entities/project/actions/project.actions', () => ({
    createProjectAction: vi.fn(() => Promise.resolve('SAVED')),
    updateProjectAction: vi.fn(() => Promise.resolve('SAVED')),
    deleteProjectAction: vi.fn(() => Promise.resolve('SAVED')),
    discardProjectImageAction: vi.fn(() => Promise.resolve('SAVED')),
}));

const PROJECT: ProjectEditorData = {
    id: 'a',
    content: {
        title: 'A',
        category: 'Admin',
        summary: 'React',
        image: {
            src: 'https://store.public.blob.vercel-storage.com/projects/a.png',
            alt: 'A 화면',
            width: 400,
            height: 200,
        },
        published: true,
        featured: true,
        team: [{ part: '프론트엔드', count: 2 }],
        role: '프론트엔드 개발',
        scope: [{ area: 'development', level: 'lead' }],
        period: { start: '2025.06' },
        stack: ['Next.js'],
        links: [{ label: '서비스', href: 'https://example.com' }],
        body: '<h2>개요</h2><p>본문</p>',
    },
    updatedAtText: '2026.11.12 (10:12)',
};

/** 이름이 붙지 않은 입력이라 폼의 항목 이름(name)으로 찾는다 */
function getInput(name: string) {
    const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!input) throw new Error(`${name} 입력을 찾지 못했다`);
    return input;
}

describe('ProjectForm', () => {
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
        // Radix 의 Select 가 목록을 열 때 부른다
        Element.prototype.hasPointerCapture = () => false;
        Element.prototype.releasePointerCapture = () => undefined;
        Element.prototype.scrollIntoView = () => undefined;
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('새 프로젝트는 비공개로 시작하고, 홈 노출은 켤 수 없다', () => {
        render(<ProjectForm project={null} />);
        expect(screen.getByRole('switch', { name: '공개' })).not.toBeChecked();
        expect(screen.getByRole('switch', { name: '홈 노출' })).toBeDisabled();
        expect(screen.getByRole('button', { name: '등록' })).toBeDisabled();
    });

    it('필수 항목을 비운 채 지나가면 그 항목의 오류 문구를 보여 준다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={null} />);

        await user.click(getInput('title'));
        await user.tab();

        expect(screen.getByText('제목을 입력해 주세요.')).toBeInTheDocument();
    });

    it('필수 항목을 채우면 등록할 수 있고, 비운 상세 주소는 보내지 않는다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={null} />);

        await user.type(getInput('title'), '새 프로젝트');
        await user.click(screen.getByRole('combobox', { name: '분류' }));
        await user.click(screen.getByRole('option', { name: 'Admin' }));
        await user.type(getInput('summary'), 'Next.js');
        await user.click(screen.getByRole('button', { name: '등록' }));

        expect(createProjectAction).toHaveBeenCalledWith({
            title: '새 프로젝트',
            category: 'Admin',
            summary: 'Next.js',
            image: null,
            published: false,
            featured: false,
            team: [],
            scope: [],
            stack: [],
            links: [],
            // 본문에는 절 제목 템플릿이 들어 있다
            body: '<h2>개요</h2><p></p><h2>문제</h2><p></p><h2>해결</h2><p></p><h2>결과</h2><p></p><h2>회고</h2><p></p>',
        });
    });

    it('공개를 켜야 홈 노출을 켤 수 있고, 공개를 끄면 홈 노출도 함께 꺼진다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={null} />);
        const published = screen.getByRole('switch', { name: '공개' });
        const featured = screen.getByRole('switch', { name: '홈 노출' });

        await user.click(published);
        expect(featured).toBeEnabled();
        await user.click(featured);
        expect(featured).toBeChecked();

        await user.click(published);
        expect(featured).not.toBeChecked();
        expect(featured).toBeDisabled();

        // 다시 공개해도 홈 노출은 꺼져 있다
        await user.click(published);
        expect(featured).not.toBeChecked();
    });

    it('수정 화면은 고친 내용이 있어야 저장할 수 있다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={PROJECT} />);
        const save = screen.getByRole('button', { name: '저장' });
        expect(save).toBeDisabled();

        await user.type(getInput('summary'), ' 19');
        expect(save).toBeEnabled();
        await user.click(save);

        expect(updateProjectAction).toHaveBeenCalledWith('a', {
            ...PROJECT.content,
            summary: 'React 19',
        });
    });

    it('분류는 정해 둔 목록에서 고른다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={null} />);

        await user.click(screen.getByRole('combobox', { name: '분류' }));

        expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
            'Admin',
            'Dashboard',
            'Design System',
            'Website',
            'Promotion',
            'Interactive',
        ]);
    });

    it('저장된 분류가 목록에 없으면 다시 골라야 저장할 수 있다', async () => {
        const user = userEvent.setup();
        render(
            <ProjectForm
                project={{ ...PROJECT, content: { ...PROJECT.content, category: 'Etc' } }}
            />,
        );
        expect(screen.getByRole('combobox', { name: '분류' })).toHaveTextContent('매칭 없음');

        // 다른 항목을 고쳐도 분류가 목록에 없어 저장할 수 없다
        await user.type(getInput('summary'), ' 19');
        expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();

        await user.click(screen.getByRole('combobox', { name: '분류' }));
        await user.click(screen.getByRole('option', { name: 'Dashboard' }));
        expect(screen.getByRole('button', { name: '저장' })).toBeEnabled();
    });

    it('저장된 상세 항목을 폼에 채운다', () => {
        render(<ProjectForm project={PROJECT} />);
        expect(getInput('team.0.part')).toHaveValue('프론트엔드');
        expect(getInput('team.0.count')).toHaveValue('2');
        expect(getInput('role')).toHaveValue('프론트엔드 개발');
        expect(getInput('period.start')).toHaveValue('2025.06');
        expect(screen.getByRole('switch', { name: '진행 중' })).toBeChecked();
        expect(getInput('period.end')).toBeDisabled();
        expect(getInput('links.0.href')).toHaveValue('https://example.com');
        expect(screen.getByRole('textbox', { name: '본문' })).toHaveValue(
            '<h2>개요</h2><p>본문</p>',
        );
    });

    it('팀에 파트를 더하고 빼고, 규칙에 맞지 않으면 저장할 수 없다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={PROJECT} />);
        const save = screen.getByRole('button', { name: '저장' });

        await user.click(screen.getByRole('button', { name: '+ 파트 추가' }));
        // 새 줄의 첫 입력으로 포커스가 간다
        expect(getInput('team.1.part')).toHaveFocus();
        await user.tab();
        expect(screen.getByText('파트를 입력해 주세요.')).toBeInTheDocument();
        expect(save).toBeDisabled();

        await user.type(getInput('team.1.part'), '디자이너');
        await user.type(getInput('team.1.count'), '1');
        expect(save).toBeEnabled();

        await user.click(screen.getByRole('button', { name: '1번째 파트 빼기' }));
        await user.click(save);
        expect(updateProjectAction).toHaveBeenCalledWith('a', {
            ...PROJECT.content,
            team: [{ part: '디자이너', count: 1 }],
        });
    });

    it('진행 중을 끄고 끝을 시작보다 앞서게 적으면 알린다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={PROJECT} />);

        await user.click(screen.getByRole('switch', { name: '진행 중' }));
        await user.type(getInput('period.end'), '2025.01');
        expect(screen.getByText('끝은 시작보다 앞설 수 없습니다.')).toBeInTheDocument();

        await user.clear(getInput('period.end'));
        await user.type(getInput('period.end'), '2026.01');
        await user.click(screen.getByRole('button', { name: '저장' }));
        expect(updateProjectAction).toHaveBeenCalledWith('a', {
            ...PROJECT.content,
            period: { start: '2025.06', end: '2026.01' },
        });
    });

    it('본문을 고치면 고친 HTML 을 저장한다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={PROJECT} />);

        await user.type(screen.getByRole('textbox', { name: '본문' }), '<p>추가</p>');
        await user.click(screen.getByRole('button', { name: '저장' }));

        expect(updateProjectAction).toHaveBeenCalledWith('a', {
            ...PROJECT.content,
            body: '<h2>개요</h2><p>본문</p><p>추가</p>',
        });
    });

    it('썸네일이 있으면 대체 텍스트가 필수다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={PROJECT} />);

        await user.clear(getInput('image.alt'));

        expect(screen.getByText('대체 텍스트를 입력해 주세요.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
    });

    it('썸네일을 지우면 대체 텍스트 입력도 사라지고 썸네일 없이 저장한다', async () => {
        const user = userEvent.setup();
        render(<ProjectForm project={PROJECT} />);

        await user.click(screen.getByRole('button', { name: '썸네일 지우기' }));
        expect(document.querySelector('input[name="image.alt"]')).toBeNull();
        await user.click(screen.getByRole('button', { name: '저장' }));

        expect(updateProjectAction).toHaveBeenCalledWith('a', { ...PROJECT.content, image: null });
    });
});
