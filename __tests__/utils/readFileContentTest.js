import fs from 'fs';
import path from 'path';
import readFileContent from '../../src/utils/readFileContent';
import { ERROR_MESSAGES } from '../../src/constants/errorMessages';

const testFilePath = path.resolve('./testFile.md');
const testContent = '파일 읽기 테스트용 텍스트!!!';

beforeAll(() => {
  // 테스트용 파일 생성
  fs.writeFileSync(testFilePath, testContent);
});

afterAll(() => {
  // 테스트용 파일 삭제
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
  }
});

test('파일 읽기 성공', async () => {
  const result = await readFileContent(testFilePath);
  expect(result).toBe(testContent);
});

test('파일 읽기 실패', async () => {
  const invalidPath = path.resolve('./invalidPath.md');

  await expect(readFileContent(invalidPath)).rejects.toThrow(new Error(ERROR_MESSAGES.FAILED_READ_FILE(invalidPath)));
});
