'use client';

import type { ReactNode } from 'react';

import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/util/cn';

import { ADORNMENT_CLASS, type inputVariants } from '../input/input';
import {
    Select as SelectRoot,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from './select.base';

/** 목록의 항목 1개. code 가 값이고 name 이 화면에 보이는 이름이다 */
interface SelectOption {
    code: string;
    name: string;
    /** 목록에는 남지만 고를 수 없다 */
    disabled?: boolean;
}

/** 묶은 목록의 한 묶음. 타입 이름이 SelectGroup 이 아닌 것은 같은 이름의 부품이 있어서다 */
interface SelectOptionGroup {
    label: string;
    options: SelectOption[];
    /** 묶음 전체를 고를 수 없다 */
    disabled?: boolean;
}

type SelectList = SelectOption[] | SelectOptionGroup[];

type SelectProps = VariantProps<typeof inputVariants> & {
    /** 고를 수 있는 항목. 그대로 늘어놓거나 묶어서 준다. 비어 있으면 스스로 비활성이 된다 */
    list: SelectList;
    /** 고른 항목의 code. 고르지 않았으면 빈 문자열이나 undefined */
    value?: string;
    onChange?: (value: string) => void;
    /** 고르지 않았을 때 보이는 글자 */
    placeholder?: string;
    /** 트리거 안쪽, 값의 앞에 붙는 글자. 입력의 이름이 아니라 꾸밈이다 */
    beforeLabel?: ReactNode;
    /** 트리거 안쪽, 값의 뒤에 붙는 글자. Kozipsa 의 label 이다 */
    afterLabel?: ReactNode;
    disabled?: boolean;
    className?: string;
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
};

/** 값은 있는데 목록에서 찾지 못했을 때 보이는 글자 */
const UNMATCHED_TEXT = '매칭 없음';

function isGrouped(list: SelectList): list is SelectOptionGroup[] {
    return list.some((item) => 'label' in item);
}

interface ItemsAttributes {
    list: SelectList;
}

/** 목록의 항목들. 묶은 목록이면 묶음마다 이름을 붙이고 사이에 선을 긋는다 */
function SelectItems({ list }: ItemsAttributes) {
    if (isGrouped(list)) {
        return list.map((group, index) => (
            <SelectGroup key={group.label}>
                {index > 0 ? <SelectSeparator /> : null}
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map((option) => (
                    <SelectItem
                        key={option.code}
                        value={option.code}
                        disabled={group.disabled === true || option.disabled === true}
                    >
                        {option.name}
                    </SelectItem>
                ))}
            </SelectGroup>
        ));
    }

    return list.map((option) => (
        <SelectItem key={option.code} value={option.code} disabled={option.disabled}>
            {option.name}
        </SelectItem>
    ));
}

/**
 * 정해진 목록에서 하나를 고르는 입력. Kozipsa 의 Select 를 가져왔다.
 * (Kozipsa packages/ui 의 custom/select/select.tsx, 2026-11-18 사용자 결정)
 * list · value · onChange · placeholder 의 이름과 동작은 Kozipsa 와 같다.
 * 값이 목록에 없으면 placeholder 로 되돌리지 않고 「매칭 없음」 을 보여 준다.
 * 값이 없는 것과 값이 있는데 찾지 못한 것은 원인이 다르다.
 * beforeLabel · afterLabel 은 Input 과 같은 이름 · 같은 모양이다. Kozipsa 는 뒤의 글자를 label 이라고 부른다.
 * 쓰는 곳이 없는 multiple · variant · loading · readonly 는 가져오지 않았다.
 */
function Select({
    list,
    value,
    onChange,
    placeholder = '선택없음',
    beforeLabel,
    afterLabel,
    disabled,
    size,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
}: SelectProps) {
    const options = isGrouped(list) ? list.flatMap((group) => group.options) : list;
    const hasValue = value !== undefined && value !== '';
    const isMatched = hasValue && options.some((option) => option.code === value);
    // 2xs 는 값의 글자(11px)가 text-xs(12px)보다 작다. 붙는 글자가 값보다 커지지 않게 값을 따른다. Input 과 같다
    const adornmentClass = cn(ADORNMENT_CLASS, size !== '2xs' && 'text-xs');

    return (
        <SelectRoot
            // 목록에 없는 값을 Radix 에 넘기면 트리거가 빈 칸이 된다. 빈 값으로 넘기고 글자는 아래에서 정한다
            value={isMatched ? value : ''}
            onValueChange={(nextValue) => {
                // Radix 는 값이 비워질 때도 부른다. 고른 것만 알린다
                if (nextValue !== '') {
                    onChange?.(nextValue);
                }
            }}
            disabled={disabled === true || list.length === 0}
        >
            <SelectTrigger
                id={id}
                size={size}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                className={className}
            >
                {beforeLabel ? <span className={adornmentClass}>{beforeLabel}</span> : null}
                {/*
                  이름이 길면 말줄임한다. SelectValue 는 className 을 받지 않아 감싼 요소에서 자른다.
                  고르지 않았을 때의 색도 여기서 준다. 트리거에 주면 붙는 글자까지 함께 흐려진다
                */}
                <span className="min-w-0 flex-1 truncate group-data-placeholder/select:text-decorative">
                    <SelectValue placeholder={hasValue ? UNMATCHED_TEXT : placeholder} />
                </span>
                {afterLabel ? <span className={adornmentClass}>{afterLabel}</span> : null}
            </SelectTrigger>
            <SelectContent>
                <SelectItems list={list} />
            </SelectContent>
        </SelectRoot>
    );
}

export { Select };
export type { SelectOption, SelectOptionGroup, SelectProps };
