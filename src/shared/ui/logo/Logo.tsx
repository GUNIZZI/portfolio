import Image from 'next/image';

interface OwnProps {
    /** 링크의 이름에 쓴다. 로고 그림 안의 글자는 스크린 리더가 읽지 못한다 */
    name: string;
}

/**
 * 가로형 로고. G 심볼 · 이름 · 직함이 그림 한 장(public/images/logo/logo.svg)에 들어 있다.
 * 누르면 페이지 맨 위로 간다. 헤더와 푸터가 함께 쓴다.
 */
export default function Logo({ name }: OwnProps) {
    return (
        <a href="#top" aria-label={`${name} 홈으로`} className="flex shrink-0 items-center">
            {/* SVG 는 이미지 최적화를 거치지 않는다. 벡터라 크기를 줄여 내려 줄 것이 없다 */}
            <Image
                src="/images/logo/logo.svg"
                alt=""
                width={144}
                height={40}
                unoptimized
                loading="eager"
                className="h-10 w-auto"
            />
        </a>
    );
}
