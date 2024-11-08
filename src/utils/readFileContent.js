import fs from 'fs';
import path from 'path';
import OutputView from '../view/OutputView.js';

const readFileContent = async function readFileContent(absolutePath) {
  try {
    const filePath = path.resolve(absolutePath);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    OutputView.printError(`${absolutePath} 경로의 파일 읽기를 실패 하였습니다.`);
    throw error;
  }
};

export default readFileContent;
