/**
 * 페이지 뒤에 깔리는 점 무늬와 가장자리 붓 자국.
 * 위치와 길이는 원본 디자인(sample/)의 값 그대로다.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-base">
      <div className="absolute inset-0 bg-[radial-gradient(var(--dot)_1px,transparent_1px)] bg-size-[18px_18px]" />
      <svg
        viewBox="0 0 60 400"
        preserveAspectRatio="none"
        className="absolute top-10 left-0 h-130 w-[clamp(24px,4vw,56px)]"
      >
        <path
          d="M0 0 C 30 40, 50 90, 26 150 C 10 190, 40 240, 30 300 C 24 340, 12 370, 0 400 Z"
          className="fill-brush-sky"
        />
      </svg>
      <svg
        viewBox="0 0 60 400"
        preserveAspectRatio="none"
        className="absolute top-0 right-0 h-90 w-[clamp(24px,4vw,56px)]"
      >
        <path
          d="M60 0 C 30 30, 20 80, 40 130 C 54 170, 22 220, 34 280 C 40 320, 50 360, 60 400 Z"
          className="fill-brush-violet"
        />
      </svg>
      <svg
        viewBox="0 0 60 300"
        preserveAspectRatio="none"
        className="absolute top-262.5 left-0 h-75 w-[clamp(20px,3vw,44px)]"
      >
        <path
          d="M0 0 C 28 50, 36 120, 18 180 C 8 220, 20 260, 0 300 Z"
          className="fill-brush-sky"
        />
      </svg>
      <svg
        viewBox="0 0 60 300"
        preserveAspectRatio="none"
        className="absolute right-0 bottom-50 h-65 w-[clamp(20px,3vw,44px)]"
      >
        <path
          d="M60 0 C 34 60, 28 120, 44 180 C 52 220, 40 260, 60 300 Z"
          className="fill-brush-violet"
        />
      </svg>
    </div>
  );
}
