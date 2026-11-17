'use client';

import { type ComponentProps, useId } from 'react';

import { Field, FieldError, FieldLabel } from '@/shared/ui/field/field';
import { Input } from '@/shared/ui/input/input';
import { Textarea } from '@/shared/ui/textarea/textarea';

interface CommonAttributes {
    /** 입력 위에 적는 이름. label 로 입력에 잇는다 */
    label?: string;
    /** 오류 문구. 있으면 입력 아래에 적는다 */
    error?: string;
    /** 이름 · 입력 · 오류 문구를 묶은 바깥 요소에 붙는다 */
    className?: string;
}

interface SingleLineAttributes
    extends CommonAttributes, Omit<ComponentProps<typeof Input>, 'className'> {
    isMultiline?: false;
}

interface MultilineAttributes
    extends CommonAttributes, Omit<ComponentProps<typeof Textarea>, 'className'> {
    /** 여러 줄 입력으로 그린다 */
    isMultiline: true;
}

type OwnProps = SingleLineAttributes | MultilineAttributes;

/** 이름 · 입력 · 오류 문구를 한 묶음으로 그린다. 소개 수정 폼의 글 입력이 모두 이 모양이다 */
export default function TextField({ label, error, className, id, ...rest }: OwnProps) {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const isInvalid = error ? true : undefined;

    return (
        <Field data-invalid={isInvalid} className={className}>
            {label ? <FieldLabel htmlFor={controlId}>{label}</FieldLabel> : null}
            {rest.isMultiline ? (
                <TextareaControl id={controlId} isInvalid={isInvalid} {...rest} />
            ) : (
                <InputControl id={controlId} isInvalid={isInvalid} {...rest} />
            )}
            <FieldError>{error}</FieldError>
        </Field>
    );
}

interface ControlAttributes {
    isInvalid: true | undefined;
}

/** isMultiline 은 입력의 속성이 아니라 걸러 낸다 */
function InputControl({
    isInvalid,
    isMultiline: _isMultiline,
    ...rest
}: ControlAttributes & Omit<SingleLineAttributes, keyof CommonAttributes>) {
    return <Input aria-invalid={isInvalid} {...rest} />;
}

function TextareaControl({
    isInvalid,
    isMultiline: _isMultiline,
    ...rest
}: ControlAttributes & Omit<MultilineAttributes, keyof CommonAttributes>) {
    return <Textarea aria-invalid={isInvalid} {...rest} />;
}
