# NavIndicator

메뉴 줄에서 지금 있는 메뉴를 가리키는 밑줄이다. 공개 헤더와 관리 헤더가 함께 쓴다.(2026-11-18 사용자 결정)
밑줄은 메뉴 줄에 하나만 있다. 메뉴를 옮기면 그 메뉴로 미끄러져 가고, 폭도 그 링크에 맞춰진다.

| prop        | 값                                                |
| ----------- | ------------------------------------------------- |
| `activeKey` | 지금 메뉴를 가리는 값. 바뀌면 자리를 다시 잰다    |
| `className` | 밑줄의 모양을 바꿀 때 쓴다. 지금은 쓰는 곳이 없다 |

함께 내보내는 클래스가 2개 있다.

| 이름                           | 붙이는 곳        | 하는 일                                            |
| ------------------------------ | ---------------- | -------------------------------------------------- |
| `NAV_INDICATOR_ROOT_CLASS`     | 메뉴 줄(`nav`)   | 밑줄이 자리를 잡는 기준이 된다                     |
| `NAV_INDICATOR_FALLBACK_CLASS` | 지금 메뉴의 링크 | 스크립트가 준비되기 전에 보이는 고정 밑줄을 그린다 |

## 쓰는 법

```tsx
<nav className={cn(NAV_INDICATOR_ROOT_CLASS, 'flex')}>
    {items.map((item) => (
        <Link
            aria-current={item.href === currentHref ? 'page' : undefined}
            className={cn('pt-2 pb-2.5', item.href === currentHref && NAV_INDICATOR_FALLBACK_CLASS)}
        />
    ))}
    <NavIndicator activeKey={currentHref} />
</nav>
```

지금 메뉴는 메뉴 줄 안의 `aria-current="page"` 로 찾는다.(`NavIndicator.tsx` 의 `measure`)

## 연출

폭이 1px 인 선을 `x` · `y` 로 옮기고 `scaleX` 로 늘린다. `left` 와 `width` 는 움직이지 않는다.(`docs/motion.md` 원칙 4)
시간과 가속도는 `DURATION.base` · `EASE.move` 다. 동작 줄이기에서는 바로 옮겨 간다.(`docs/motion.md` 3절)
페이지를 처음 그릴 때는 잰 자리에 바로 그린다. 서체가 늦게 실리거나 화면 폭이 바뀌면 자리를 다시 잰다.

## 자주 하는 실수

- 메뉴 줄에 `NAV_INDICATOR_ROOT_CLASS` 를 빠뜨리면 밑줄이 엉뚱한 자리에 놓인다. 밑줄은 메뉴 줄을 기준으로 자리를 잡는다.
- 링크의 아래 여백을 줄이면 밑줄이 글자에 붙는다. 밑줄은 링크의 아래 끝 2px 에 놓인다.
- 밑줄을 링크마다 두지 않는다. 메뉴 줄에 하나만 둔다.

## 이 컴포넌트를 고칠 때

framer-motion 의 `layoutId` 로 바꾸지 않는다. 공개 헤더는 화면에 붙어 있어, 페이지를 옮기며 스크롤이 맨 위로 돌아간 만큼 밑줄이 아래에서 날아온다.(2026-11-18 확인)
쓰는 곳은 `src/widgets/header/HeaderBar.tsx` 와 `src/widgets/adminHeader/AdminNav.tsx` 다.
