import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Switch } from '../switch';

describe('Switch', () => {
    it('누르면 뒤집은 값으로 onCheckedChange 를 부른다', async () => {
        const hndlChange = vi.fn();
        render(<Switch aria-label="재직 중" checked={false} onCheckedChange={hndlChange} />);

        const control = screen.getByRole('switch', { name: '재직 중' });
        expect(control).not.toBeChecked();

        await userEvent.click(control);
        expect(hndlChange).toHaveBeenCalledExactlyOnceWith(true);
    });

    it('label 을 눌러도 바뀐다', async () => {
        const hndlChange = vi.fn();
        render(
            <>
                <label htmlFor="current">재직 중</label>
                <Switch id="current" checked onCheckedChange={hndlChange} />
            </>,
        );

        await userEvent.click(screen.getByText('재직 중'));
        expect(hndlChange).toHaveBeenCalledExactlyOnceWith(false);
    });
});
