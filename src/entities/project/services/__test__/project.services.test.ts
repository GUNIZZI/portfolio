import { getProjectList, toProjectData } from '../project.services';

describe('toProjectData', () => {
  it('상세 주소가 없으면 작업 상세를 가리킨다', () => {
    const data = toProjectData({
      slug: 'a',
      title: 'A',
      category: 'Web',
      summary: 'React',
      image: null,
    });
    expect(data.href).toBe('/work/a');
  });

  it('상세 주소가 있으면 그대로 쓴다', () => {
    const data = toProjectData({
      slug: 'a',
      title: 'A',
      category: 'Web',
      summary: 'React',
      href: 'https://example.com',
      image: null,
    });
    expect(data.href).toBe('https://example.com');
  });
});

describe('getProjectList', () => {
  it('원문을 검증해 순서대로 낸다', async () => {
    const list = await getProjectList();
    expect(list.length).toBeGreaterThan(0);
    expect(new Set(list.map((project) => project.slug)).size).toBe(list.length);
  });
});
