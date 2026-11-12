import js from '@eslint/js';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import boundaries from 'eslint-plugin-boundaries';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

/**
 * 계층 정의. 의존은 app → widgets → features → entities → shared 한 방향이다.
 * 규칙 전문은 docs/architecture.md 에 있다.
 */
const LAYERS = [
    { type: 'app', pattern: 'src/app' },
    { type: '_app', pattern: 'src/_app' },
    { type: 'widgets', pattern: 'src/widgets/*', capture: ['slice'] },
    { type: 'features', pattern: 'src/features/*', capture: ['slice'] },
    { type: 'entities', pattern: 'src/entities/*', capture: ['slice'] },
    { type: 'shared', pattern: 'src/shared' },
    { type: 'config', pattern: 'src/config' },
    { type: 'style', pattern: 'src/style' },
    { type: 'asset', pattern: 'src/asset' },
    { type: 'types', pattern: 'src/types' },
    { type: 'content', pattern: 'content' },
];

const BASE = ['shared', 'config', 'style', 'asset', 'types'];

export default defineConfig([
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'coverage/**',
        'playwright-report/**',
        'test-results/**',
        'next-env.d.ts',
        // 기획 문서의 와이어프레임 렌더러. 브라우저에서 단독으로 도는 산출물이다
        'docs/plan/**',
    ]),

    js.configs.recommended,
    ...nextVitals,

    // TypeScript — 타입 정보 기반 strict 규칙
    {
        files: ['**/*.{ts,tsx,mts,cts}'],
        extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/consistent-type-exports': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
            // 네이밍 — docs/conventions.md 2절
            '@typescript-eslint/naming-convention': [
                'error',
                { selector: 'typeLike', format: ['PascalCase'] },
                { selector: 'typeParameter', format: ['PascalCase'] },
                {
                    selector: 'variable',
                    modifiers: ['const'],
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                { selector: 'function', format: ['camelCase', 'PascalCase'] },
            ],
        },
    },

    // 공통 품질 규칙
    {
        rules: {
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'object-shorthand': 'error',
            'prefer-template': 'error',
            'no-nested-ternary': 'error',
            'no-param-reassign': 'error',
            'react/jsx-no-useless-fragment': 'error',
            'react/self-closing-comp': 'error',
            'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
            'react/function-component-definition': [
                'error',
                { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
            ],
            'react-hooks/exhaustive-deps': 'error',
        },
    },

    // eslint-disable 에는 `-- 이유` 를 단다 (docs/conventions.md 4.6)
    {
        plugins: { '@eslint-community/eslint-comments': eslintComments },
        rules: {
            '@eslint-community/eslint-comments/require-description': 'error',
            '@eslint-community/eslint-comments/no-unused-disable': 'error',
            '@eslint-community/eslint-comments/disable-enable-pair': 'error',
        },
    },

    // import 순서 (docs/conventions.md 2.4)
    {
        plugins: { 'simple-import-sort': simpleImportSort },
        rules: {
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^\\u0000'],
                        ['^react(-dom)?(/.*)?\\u0000?$', '^next(/.*)?\\u0000?$'],
                        ['^node:', '^@?\\w'],
                        [
                            '^@/_app',
                            '^@/widgets',
                            '^@/features',
                            '^@/entities',
                            '^@/shared',
                            '^@/config',
                            '^@/style',
                            '^@/asset',
                            '^@/types',
                            '^@content',
                        ],
                        [
                            '^\\.\\.(?!/?$)',
                            '^\\.\\./?$',
                            '^\\./(?=.*/)(?!/?$)',
                            '^\\.(?!/?$)',
                            '^\\./?$',
                        ],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': ['error', { 'prefer-inline': true }],
            'import/no-default-export': 'off',
        },
    },

    // 계층 의존 방향 (docs/architecture.md 3절)
    {
        files: ['src/**/*.{ts,tsx}'],
        plugins: { boundaries },
        settings: {
            'import/resolver': { typescript: { alwaysTryTypes: true } },
            'boundaries/include': ['src/**/*', 'content/**/*'],
            'boundaries/elements': LAYERS,
        },
        rules: {
            'boundaries/dependencies': [
                'error',
                {
                    default: 'disallow',
                    message:
                        '{{from.type}} 는 {{to.type}} 를 import 할 수 없다 — docs/architecture.md 3절',
                    policies: [
                        {
                            from: { element: { type: 'app' } },
                            allow: {
                                to: {
                                    element: {
                                        types: ['_app', 'widgets', 'features', 'entities', ...BASE],
                                    },
                                },
                            },
                        },
                        {
                            from: { element: { type: '_app' } },
                            allow: { to: { element: { types: BASE } } },
                        },
                        {
                            from: { element: { type: 'widgets' } },
                            allow: {
                                to: { element: { types: ['features', 'entities', ...BASE] } },
                            },
                        },
                        {
                            from: { element: { type: 'features' } },
                            allow: { to: { element: { types: ['entities', ...BASE] } } },
                        },
                        {
                            from: { element: { type: 'entities' } },
                            allow: { to: { element: { types: ['content', ...BASE] } } },
                        },
                        {
                            from: { element: { types: ['shared', 'config'] } },
                            allow: { to: { element: { types: BASE } } },
                        },
                    ],
                },
            ],
        },
    },

    // 슬라이스는 index.ts 로만 공개한다 (docs/conventions.md 4.1)
    {
        files: ['src/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            regex: '^@/(widgets|features)/[^/]+/.+',
                            message:
                                '슬라이스 내부를 직접 import 하지 않는다. index.ts 로 가져온다.',
                        },
                        {
                            // group 은 경로의 한 마디만 맞아도 걸려 @/shared/util/gsap 까지 막는다. 패키지 이름 전체로 맞춘다
                            regex: '^(gsap(/.*)?|@gsap/react)$',
                            message:
                                'GSAP 은 @/shared/util/gsap 에서 가져온다 — docs/motion.md 2.1',
                        },
                    ],
                },
            ],
        },
    },

    // GSAP 을 등록하는 단 한 곳
    {
        files: ['src/shared/util/gsap.ts'],
        rules: { 'no-restricted-imports': 'off' },
    },

    // Next 가 default export 를 요구하는 파일과 설정 파일
    {
        files: ['*.config.{ts,mjs,js}', '*.setup.ts'],
        rules: { 'import/no-anonymous-default-export': 'off' },
    },

    // 테스트
    {
        files: ['**/__test__/**/*.{ts,tsx}', 'e2e/**/*.ts'],
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },

    // 비 TS 파일은 타입 기반 규칙을 끈다
    {
        files: ['**/*.{js,mjs,cjs}'],
        extends: [tseslint.configs.disableTypeChecked],
    },

    prettier,
]);
