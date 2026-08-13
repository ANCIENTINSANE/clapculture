import { ID } from 'node-appwrite';
import { getAppwriteClient } from './appwrite';
import { Env } from '@clapculture/shared';

export const uploadFile = async (env: Env, bucketId: string, file: File, permissions?: string[]) => {
  const { storage } = getAppwriteClient(env);
  const response = await storage.createFile(bucketId, ID.unique(), file as any, permissions);
  return response;
};

export const getFileUrl = (env: Env, bucketId: string, fileId: string) => {
  return `${env.APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${env.APPWRITE_PROJECT_ID}`;
};
