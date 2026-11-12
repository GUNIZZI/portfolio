interface OwnProps {
  name: string;
  role: string;
}

/** 세 줄 붓 자국 표시와 이름. 헤더와 푸터가 함께 쓴다 */
export default function Logo({ name, role }: OwnProps) {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <svg width="44" height="30" viewBox="0 0 44 30" aria-hidden="true">
        <path
          d="M4 26 L14 4"
          className="stroke-doodle-blue"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M16 26 L26 4"
          className="stroke-doodle-indigo"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M28 26 L38 4"
          className="stroke-doodle-violet"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-wide">{name}</span>
        <span className="text-2xs text-muted">{role}</span>
      </span>
    </a>
  );
}
