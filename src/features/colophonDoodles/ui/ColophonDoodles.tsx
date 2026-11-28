import Doodle from '@/shared/ui/doodle/Doodle';

import { COLOPHON_DOODLES } from '../model/colophonDoodles.constants';

/** 「제작 과정」 배경에 흩어 놓는 낙서. `<Backdrop>` 안에 둔다 */
export default function ColophonDoodles() {
    return COLOPHON_DOODLES.map((doodle) => (
        <Doodle
            key={doodle.position}
            shape={doodle.shape}
            tone={doodle.tone}
            lag={doodle.lag}
            className={doodle.position}
        />
    ));
}
