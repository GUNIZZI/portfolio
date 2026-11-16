import { DOODLE_FILTER_ID } from './doodle.constants';

/**
 * 낙서에 붓 질감을 입히는 SVG 필터. 페이지에 한 번만 둔다. Backdrop 이 넣는다.
 * 가장자리를 거칠게 흩고(displace), 군데군데 물감이 덜 묻은 자국을 낸다(gaps).
 */
export default function DoodleFilter() {
    return (
        <svg className="absolute size-0">
            <defs>
                <filter
                    id={DOODLE_FILTER_ID}
                    x="-25%"
                    y="-25%"
                    width="150%"
                    height="150%"
                    primitiveUnits="userSpaceOnUse"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.55"
                        numOctaves="2"
                        seed="7"
                        result="grain"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="grain"
                        scale="2.4"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="rough"
                    />
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05 0.32"
                        numOctaves="1"
                        seed="11"
                        result="streak"
                    />
                    <feColorMatrix
                        in="streak"
                        type="matrix"
                        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -14 4.6"
                        result="gaps"
                    />
                    <feComposite in="rough" in2="gaps" operator="out" />
                </filter>
            </defs>
        </svg>
    );
}
