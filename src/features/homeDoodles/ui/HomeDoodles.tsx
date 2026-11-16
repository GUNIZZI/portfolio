import Doodle from '@/shared/ui/doodle/Doodle';

import { HOME_DOODLES } from '../model/homeDoodles.constants';

/** 홈 배경에 흩어 놓는 낙서. `<Backdrop>` 안에 둔다 */
export default function HomeDoodles() {
    return HOME_DOODLES.map((doodle) => (
        <Doodle
            key={doodle.position}
            shape={doodle.shape}
            tone={doodle.tone}
            lag={doodle.lag}
            className={doodle.position}
        />
    ));
}
