import path from 'path';
import { fileURLToPath } from 'url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
export const serverDirectory = path.resolve(currentDirectory, '../..');
export const uploadDirectory = path.join(serverDirectory, 'uploads');
export const privateVerificationDirectory = path.join(uploadDirectory, 'private-verification');