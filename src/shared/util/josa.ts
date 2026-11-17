/** 낱말의 마지막 글자에 받침이 있는가. 한글이 아니면 없다고 본다 */
function hasFinalConsonant(word: string): boolean {
    const code = word.charCodeAt(word.length - 1);
    const HANGUL_START = 0xac00;
    const HANGUL_END = 0xd7a3;
    const FINAL_COUNT = 28;
    if (Number.isNaN(code) || code < HANGUL_START || code > HANGUL_END) {
        return false;
    }
    return (code - HANGUL_START) % FINAL_COUNT !== 0;
}

/**
 * 낱말 뒤에 목적격 조사를 붙인다
 * @param word - 조사를 붙일 낱말
 * @returns 받침이 있으면 을, 없으면 를을 붙인 말
 * @example withObjectParticle('제목') // '제목을'
 * @example withObjectParticle('성장 경로') // '성장 경로를'
 */
export function withObjectParticle(word: string): string {
    return `${word}${hasFinalConsonant(word) ? '을' : '를'}`;
}
