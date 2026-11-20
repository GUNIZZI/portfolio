# Logo

가로형 로고를 표시한다. G 심볼 · 이름 · 직함이 그림 한 장에 들어 있다.(2026-11-16 사용자 결정)
홈에서는 누르면 페이지 맨 위로, 다른 페이지에서는 홈으로 간다. 헤더와 푸터가 함께 쓴다.

| prop   | 값                                                    |
| ------ | ----------------------------------------------------- |
| `name` | 링크의 이름에 쓰는 이름. 「GUNI 홈으로」              |
| `href` | 누르면 가는 곳. 기본은 `#top`                         |
| `size` | 높이(px). `sm`(28) · `md`(40) · `lg`(48). 기본은 `md` |

값은 `src/config/site.ts` 의 `SITE` 에서 넘긴다.

## 자주 하는 실수

- 이름이나 직함을 바꿀 때 `SITE` 만 고치지 않는다. 로고 안의 글자는 그림이라 함께 바뀌지 않는다.

## 이 컴포넌트를 고칠 때

그림은 `public/images/logo/logo.svg`(다크)와 `logo-light.svg`(라이트) 2장이다. 글자색만 다르다.(`Logo.tsx` 의 `LOGO_IMAGES`)
그림을 바꿀 때는 2장을 함께 바꾼다. G 심볼을 바꾸면 심볼만 떼어 낸 `symbol.svg` 도 함께 바꾼다.(`src/shared/ui/logoLoader/LogoLoader.md`) 비율은 1312:364 이고, 높이는 `size` 가 정하며 폭은 비율을 따른다.(`Logo.tsx` 의 `LOGO_SIZE_CLASS`)
직함 글자는 윤곽선(path)이다. 원본의 `Frontend Developer` 를 `Web Frontend Developer` 로 다시 짰다.(2026-11-16 사용자 결정)
