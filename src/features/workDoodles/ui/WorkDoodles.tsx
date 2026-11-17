import Doodle from '@/shared/ui/doodle/Doodle';

import { WORK_DOODLES } from '../model/workDoodles.constants';

/** 작업 목록과 상세의 배경에 흩어 놓는 낙서. `<Backdrop>` 안에 둔다 */
export default function WorkDoodles() {
    return WORK_DOODLES.map((doodle) => (
        <Doodle
            key={doodle.position}
            shape={doodle.shape}
            tone={doodle.tone}
            lag={doodle.lag}
            className={doodle.position}
        />
    ));
}
