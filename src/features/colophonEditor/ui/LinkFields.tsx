'use client';

import {
    type Control,
    type FieldErrors,
    useFieldArray,
    type UseFormRegister,
} from 'react-hook-form';

import { COLOPHON_MIN } from '@/entities/colophon/model/colophon.constants';
import type { ColophonDevelopType } from '@/entities/colophon/model/colophon.schemas';
import { Button } from '@/shared/ui/button/button';
import TextField from '@/shared/ui/textField/TextField';
import { cn } from '@/shared/util/cn';

import RowActions from './RowActions';

interface OwnProps {
    control: Control<ColophonDevelopType>;
    register: UseFormRegister<ColophonDevelopType>;
    /** 이 링크들이 속한 단계의 자리 */
    stepIndex: number;
    /** 그 단계의 오류. 링크마다의 오류를 여기서 꺼낸다 */
    errors: NonNullable<FieldErrors<ColophonDevelopType>['items']>[number] | undefined;
}

/** 개발 과정 한 단계의 링크 목록. 이름과 주소가 한 쌍이고, 더하고 빼고 순서를 바꾼다. 모두 빼도 된다 */
export default function LinkFields({ control, register, stepIndex, errors }: OwnProps) {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: `items.${stepIndex}.links`,
    });

    function hndlAdd() {
        append({ label: '', href: '' });
    }

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">링크</p>
            {fields.map((field, index) => {
                const linkErrors = errors?.links?.[index];
                const name = `${stepIndex + 1}단계 링크 ${index + 1}`;

                return (
                    <div
                        key={field.id}
                        className={cn(
                            'flex flex-col items-end gap-2 rounded-lg bg-chip/50 p-3',
                            'md:flex-row md:items-start',
                        )}
                    >
                        <TextField
                            afterLabel="이름"
                            aria-label={`${name} 이름`}
                            {...register(`items.${stepIndex}.links.${index}.label`)}
                            error={linkErrors?.label?.message}
                            className="w-full md:w-60"
                        />
                        <TextField
                            afterLabel="주소"
                            aria-label={`${name} 주소`}
                            {...register(`items.${stepIndex}.links.${index}.href`)}
                            error={linkErrors?.href?.message}
                            className="w-full flex-1"
                        />
                        <RowActions
                            name={name}
                            index={index}
                            count={fields.length}
                            min={COLOPHON_MIN.LINKS}
                            onMove={move}
                            onRemove={remove}
                            className="md:mt-1.5"
                        />
                    </div>
                );
            })}
            <div>
                <Button variant="secondary" size="sm" onClick={hndlAdd} className="items-center">
                    + 링크 더하기
                </Button>
            </div>
        </div>
    );
}
