import Doodle from '@/shared/ui/doodle/Doodle';

import { ABOUT_DOODLES } from '../model/aboutDoodles.constants';

/** 소개 배경에 흩어 놓는 낙서. `<Backdrop>` 안에 둔다 */
export default function AboutDoodles() {
    return ABOUT_DOODLES.map((doodle) => (
        <Doodle
            key={doodle.position}
            shape={doodle.shape}
            tone={doodle.tone}
            lag={doodle.lag}
            className={doodle.position}
        />
    ));
}
