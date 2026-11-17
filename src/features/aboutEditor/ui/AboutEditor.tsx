import type { AboutEditorData } from '@/entities/about/model/about.types';

import { ToastProvider } from '../model/aboutEditor.contexts';
import HomeForm from './HomeForm';
import IntroForm from './IntroForm';
import PrinciplesForm from './PrinciplesForm';
import SkillGroupsForm from './SkillGroupsForm';

interface OwnProps {
    /** 저장소에서 읽은 소개 내용. 페이지가 읽어 넘긴다 */
    data: AboutEditorData;
}

/** 소개 수정 화면(S-01). 섹션 4개를 공개 화면에 보이는 순서로 놓고, 섹션마다 따로 저장한다 */
export default function AboutEditor({ data }: OwnProps) {
    return (
        <ToastProvider>
            <div className="flex flex-col gap-8">
                <IntroForm data={data.intro} />
                <PrinciplesForm data={data.principles} />
                <SkillGroupsForm data={data.skillGroups} />
                <HomeForm data={data.home} />
            </div>
        </ToastProvider>
    );
}
