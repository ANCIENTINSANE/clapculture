import { ID } from 'node-appwrite';
import { getAppwriteClient } from './appwrite';

export const uploadFile = async (env: any, bucketId: string, file: File | { buffer: Buffer; fileName: string; mimeType: string }, permissions?: string[]) => {
  const { storage } = getAppwriteClient(env);
  
  let inputFile: any;
  if ('buffer' in file) {
    const uint8Array = new Uint8Array(file.buffer);
    inputFile = new File([uint8Array], file.fileName, { type: file.mimeType });
  } else {
    inputFile = file;
  }
  
  const response = await storage.createFile(bucketId, ID.unique(), inputFile, permissions);
  return response;
};

export const getFileUrl = (env: any, bucketId: string, fileId: string) => {
  const endpoint = env?.APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = env?.APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '';
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};
