import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Select } from '../select';

const LIST = [
    { code: 'kozipsa', name: 'Kozipsa' },
    { code: 'portfolio', name: 'Portfolio' },
];

describe('Select 의 트리거 글자', () => {
    it('고른 값이 없으면 placeholder 를 보여 준다', () => {
        render(<Select aria-label="연결" list={LIST} value="" placeholder="잇지 않음" />);

        expect(screen.getByRole('combobox', { name: '연결' })).toHaveTextContent('잇지 않음');
    });

    it('고른 값이 목록에 있으면 그 이름을 보여 준다', () => {
        render(<Select aria-label="연결" list={LIST} value="portfolio" />);

        expect(screen.getByRole('combobox', { name: '연결' })).toHaveTextContent('Portfolio');
    });

    it('값이 목록에 없으면 placeholder 가 아니라 「매칭 없음」 을 보여 준다', () => {
        render(<Select aria-label="연결" list={LIST} value="removed" placeholder="잇지 않음" />);

        expect(screen.getByRole('combobox', { name: '연결' })).toHaveTextContent('매칭 없음');
    });
});

describe('Select 의 붙는 글자', () => {
    it('beforeLabel · afterLabel 을 값의 앞뒤에 그린다', () => {
        render(
            <Select
                aria-label="연결"
                list={LIST}
                value="portfolio"
                beforeLabel="앞"
                afterLabel="뒤"
            />,
        );

        expect(screen.getByRole('combobox', { name: '연결' })).toHaveTextContent('앞Portfolio뒤');
    });
});

describe('Select 의 비활성', () => {
    it('목록이 비어 있으면 스스로 비활성이 된다', () => {
        render(<Select aria-label="연결" list={[]} />);

        expect(screen.getByRole('combobox', { name: '연결' })).toBeDisabled();
    });
});

describe('Select 에서 고르기', () => {
    // jsdom 에 없는 것을 채운다. Radix 가 목록을 열 때 부른다
    beforeAll(() => {
        Element.prototype.hasPointerCapture = () => false;
        Element.prototype.releasePointerCapture = () => undefined;
        Element.prototype.scrollIntoView = () => undefined;
    });

    it('목록을 열어 항목을 고르면 그 code 로 onChange 를 부른다', async () => {
        const hndlChange = vi.fn();
        render(<Select aria-label="연결" list={LIST} value="kozipsa" onChange={hndlChange} />);

        await userEvent.click(screen.getByRole('combobox', { name: '연결' }));
        await userEvent.click(screen.getByRole('option', { name: 'Portfolio' }));

        expect(hndlChange).toHaveBeenCalledExactlyOnceWith('portfolio');
    });
});
