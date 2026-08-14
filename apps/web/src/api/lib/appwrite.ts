import { Client, Databases, Storage, Users, Messaging } from 'node-appwrite';

export interface AppwriteEnv {
  APPWRITE_ENDPOINT?: string;
  APPWRITE_PROJECT_ID?: string;
  APPWRITE_API_KEY?: string;
  [key: string]: string | undefined;
}

export const getAppwriteClient = (env?: AppwriteEnv) => {
  const endpoint = env?.APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
  const projectId = env?.APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '';
  const apiKey = env?.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY || '';

  const client = new Client();
  if (endpoint) client.setEndpoint(endpoint);
  if (projectId) client.setProject(projectId);
  if (apiKey) client.setKey(apiKey);

  const databases = new Databases(client);
  const storage = new Storage(client);
  const users = new Users(client);
  const messaging = new Messaging(client);

  return { client, databases, storage, users, messaging };
};