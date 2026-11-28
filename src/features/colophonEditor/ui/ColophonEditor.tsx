import type { ColophonEditorData } from '@/entities/colophon/model/colophon.types';

import DesignForm from './DesignForm';
import DevelopForm from './DevelopForm';
import GuardsForm from './GuardsForm';
import HeadForm from './HeadForm';
import HumanForm from './HumanForm';
import ProcessForm from './ProcessForm';
import StackForm from './StackForm';

interface OwnProps {
    /** 저장소에서 읽은 내용. 저장한 적이 없는 섹션은 처음 값이다. 페이지가 읽어 넘긴다 */
    data: ColophonEditorData;
}

/** 「제작 과정」 수정 화면(S-01). 섹션 7개를 공개 화면에 보이는 순서로 놓고, 섹션마다 따로 저장한다 */
export default function ColophonEditor({ data }: OwnProps) {
    return (
        <div className="flex flex-col gap-8">
            <HeadForm data={data.head} />
            <ProcessForm data={data.process} />
            <DesignForm data={data.design} />
            <DevelopForm data={data.develop} />
            <GuardsForm data={data.guards} />
            <HumanForm data={data.human} />
            <StackForm data={data.stack} />
        </div>
    );
}
