import { ID } from 'node-appwrite';
import { getAppwriteClient, AppwriteEnv } from './appwrite';

export const uploadFile = async (
  env: AppwriteEnv | undefined,
  bucketId: string,
  file: File | { buffer: Buffer; fileName: string; mimeType: string },
  permissions?: string[]
) => {
  const { storage } = getAppwriteClient(env);
  
  let inputFile: File;
  if ('buffer' in file) {
    const uint8Array = new Uint8Array(file.buffer);
    inputFile = new File([uint8Array], file.fileName, { type: file.mimeType });
  } else {
    inputFile = file;
  }
  
  const response = await storage.createFile(bucketId, ID.unique(), inputFile, permissions);
  return response;
};

export const getFileUrl = (env: AppwriteEnv | undefined, bucketId: string, fileId: string) => {
  const endpoint = env?.APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
  const projectId = env?.APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '';
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};
