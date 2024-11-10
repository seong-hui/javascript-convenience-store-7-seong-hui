import fs from 'fs';
import path from 'path';
import OutputView from '../view/OutputView.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

const readFileContent = async function readFileContent(absolutePath) {
  try {
    const filePath = path.resolve(absolutePath);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    OutputView.printError(ERROR_MESSAGES.FAILED_READ_FILE(absolutePath));
    throw error;
  }
};

export default readFileContent;
