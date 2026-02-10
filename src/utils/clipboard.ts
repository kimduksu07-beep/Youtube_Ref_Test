/**
 * 클립보드 복사 유틸리티 모듈
 */

import clipboardy from 'clipboardy';
import chalk from 'chalk';

/**
 * 텍스트를 클립보드에 복사합니다
 *
 * @param text - 복사할 텍스트
 * @param filePath - 실패 시 표시할 파일 경로 (선택사항)
 * @returns 복사 성공 여부
 */
export async function copyToClipboard(text: string, filePath?: string): Promise<boolean> {
  try {
    await clipboardy.write(text);
    console.log(chalk.green('📋 클립보드에 복사되었습니다!'));
    return true;
  } catch (error) {
    console.warn(chalk.yellow('\n⚠️ 클립보드 복사에 실패했습니다.'));
    if (filePath) {
      console.log(chalk.cyan(`📁 파일에서 직접 복사해주세요: ${filePath}\n`));
    }
    return false;
  }
}

/**
 * 여러 텍스트를 구분자와 함께 클립보드에 복사합니다
 *
 * @param texts - 복사할 텍스트 배열
 * @param separator - 구분자 (기본값: 두 줄 바꿈)
 * @param filePath - 실패 시 표시할 파일 경로 (선택사항)
 * @returns 복사 성공 여부
 */
export async function copyMultipleToClipboard(
  texts: string[],
  separator: string = '\n\n---\n\n',
  filePath?: string
): Promise<boolean> {
  const combined = texts.join(separator);
  return await copyToClipboard(combined, filePath);
}
