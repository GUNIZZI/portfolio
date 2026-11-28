import { Button } from '@/shared/ui/button/button';

interface OwnProps {
    /** 버튼의 문구. + 단계 더하기처럼 무엇을 더하는지 적는다 */
    label: string;
    onClick: () => void;
}

/** 목록의 맨 아래에 빈 항목을 더하는 버튼 */
export default function AddButton({ label, onClick }: OwnProps) {
    return (
        <div className="text-center">
            <Button variant="secondary" size="sm" onClick={onClick} className="items-center px-10">
                {label}
            </Button>
        </div>
    );
}
