import Image from 'next/image';

import { DOODLE_SHAPES } from '@/shared/ui/doodle/doodle.constants';
import DrawnPath from '@/shared/ui/drawnPath/DrawnPath';
import { cn } from '@/shared/util/cn';

import type { StatusDoodle } from '../model/statusScreen.constants';

interface OwnProps {
    src: string;
    alt: string;
    /** 그림 칸의 비율과 최대 폭. 그림 파일의 비율과 같아야 낙서의 자리가 맞는다 */
    className: string;
    /** `next/image` 의 sizes */
    sizes: string;
    doodles: readonly StatusDoodle[];
}

/** 캐릭터 일러스트와 그 둘레의 낙서. 낙서는 화면에 들어올 때 한 번 그려진다 */
export default function StatusVisual({ src, alt, className, sizes, doodles }: OwnProps) {
    return (
        <div className="flex min-w-0 flex-[1.4_1_380px] justify-center">
            <div className={cn('relative w-full', className)}>
                {/* 캐릭터 뒤로 번지는 빛 */}
                <div
                    aria-hidden="true"
                    className="absolute inset-[20%] z-base rounded-full bg-glow blur-3xl"
                />
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    loading="eager"
                    fetchPriority="high"
                    className="z-raised object-contain"
                />
                {doodles.map((doodle) => (
                    <svg
                        key={doodle.shape}
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                        className={cn('absolute z-float', doodle.position)}
                    >
                        <DrawnPath
                            d={DOODLE_SHAPES[doodle.shape].d}
                            className={doodle.stroke}
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ))}
            </div>
        </div>
    );
}
