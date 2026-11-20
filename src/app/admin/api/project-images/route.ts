import { createProjectImageUploadToken } from '@/entities/project/services/project.services';
import { getSession } from '@/entities/session/services/session.services';

/**
 * 프로젝트 썸네일을 올릴 권한을 내준다. 브라우저는 여기서 받은 토큰으로 이미지 저장소에 파일을 바로 올린다.
 * 파일이 서버를 거치지 않아, 서버가 받을 수 있는 요청 크기(4.5MB)보다 큰 5MB 까지 올릴 수 있다.
 * (docs/plan/admin/README.md 「등록 · 수정」)
 * 서버 액션이 아니라 라우트인 것은 @vercel/blob 의 upload 가 주소로 토큰을 요청하기 때문이다
 */
export async function POST(request: Request): Promise<Response> {
    // 로그인한 관리자에게만 내준다. 화면이 아니라 로그인으로 보내지 않고 401 로 알린다
    const session = await getSession();
    if (!session) {
        return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    try {
        const body: unknown = await request.json();
        return Response.json(await createProjectImageUploadToken(request, body));
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'INVALID_REQUEST' }, { status: 400 });
    }
}
