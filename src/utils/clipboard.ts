/**
 * 클립보드 복사 유틸리티 모듈
 */

import clipboardy from 'clipboardy';

/**
 * 텍스트를 클립보드에 복사합니다
 *
 * @param text - 복사할 텍스트
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await clipboardy.write(text);
    console.log('📋 클립보드에 복사되었습니다!');
  } catch (error) {
    console.error('⚠️ 클립보드 복사에 실패했습니다:', error);
  }
}

/**
 * 여러 텍스트를 구분자와 함께 클립보드에 복사합니다
 *
 * @param texts - 복사할 텍스트 배열
 * @param separator - 구분자 (기본값: 두 줄 바꿈)
 */
export async function copyMultipleToClipboard(
  texts: string[],
  separator: string = '\n\n---\n\n'
): Promise<void> {
  const combined = texts.join(separator);
  await copyToClipboard(combined);
}
