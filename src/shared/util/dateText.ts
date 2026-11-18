const UPDATED_AT_FORMAT = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});

/**
 * 저장한 시각을 관리 화면의 수정 일시 문구로 바꾼다. 한국 시각으로 적는다
 * @param updatedAt - 저장한 시각(ISO 8601). 기록이 없으면 null
 * @returns 2026.11.17 (10:12) 형식의 문구. 기록이 없으면 null
 */
export function toUpdatedAtText(updatedAt: string | null): string | null {
    if (!updatedAt) {
        return null;
    }
    const parts = Object.fromEntries(
        UPDATED_AT_FORMAT.formatToParts(new Date(updatedAt)).map((part) => [part.type, part.value]),
    );
    return `${parts['year']}.${parts['month']}.${parts['day']} (${parts['hour']}:${parts['minute']})`;
}
