import { AppwriteEnv } from './appwrite';

export interface AppwriteUploadResult {
  $id: string;
  bucketId: string;
  name: string;
  mimeType: string;
  sizeOriginal: number;
  [key: string]: unknown;
}

export const uploadFile = async (
  env: AppwriteEnv | undefined,
  bucketId: string,
  file: File | Blob | { buffer: Buffer | Uint8Array; fileName: string; mimeType: string },
  permissions?: string[]
): Promise<AppwriteUploadResult> => {
  const endpoint = env?.APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
  const projectId = env?.APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '6a7dfa97003713198186';
  const apiKey = env?.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY || '';

  const formData = new FormData();
  formData.append('fileId', 'unique()');

  if ('buffer' in file) {
    const uint8 = new Uint8Array(file.buffer);
    const blob = new Blob([uint8], { type: file.mimeType || 'image/jpeg' });
    formData.append('file', blob, file.fileName || 'upload.jpg');
  } else if (file instanceof File || (file && typeof file === 'object' && 'name' in file)) {
    const f = file as File;
    formData.append('file', f, f.name || 'upload.jpg');
  } else if (file instanceof Blob) {
    formData.append('file', file, 'upload.jpg');
  }

  if (permissions && permissions.length > 0) {
    permissions.forEach((p, idx) => {
      formData.append(`permissions[${idx}]`, p);
    });
  }

  const response = await fetch(`${endpoint}/storage/buckets/${bucketId}/files`, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': projectId,
      'X-Appwrite-Key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Appwrite upload failed with status ${response.status}`;
    try {
      const errJson = JSON.parse(errorText);
      errorMessage = errJson.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const result = (await response.json()) as AppwriteUploadResult;
  return result;
};

export const deleteFile = async (
  env: AppwriteEnv | undefined,
  bucketId: string,
  fileId: string
): Promise<boolean> => {
  const endpoint = env?.APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
  const projectId = env?.APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '6a7dfa97003713198186';
  const apiKey = env?.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY || '';

  const response = await fetch(`${endpoint}/storage/buckets/${bucketId}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      'X-Appwrite-Project': projectId,
      'X-Appwrite-Key': apiKey,
    },
  });

  return response.status === 204 || response.ok;
};

export const getFileUrl = (env: AppwriteEnv | undefined, bucketId: string, fileId: string) => {
  const endpoint = env?.APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
  const projectId = env?.APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '6a7dfa97003713198186';
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};
