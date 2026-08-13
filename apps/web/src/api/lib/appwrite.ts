import { Client, Databases, Storage } from 'node-appwrite';

export const getAppwriteClient = (env?: any) => {
  const endpoint = env?.APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = env?.APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '';
  const apiKey = env?.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY || '';

  const client = new Client();
  if (endpoint) client.setEndpoint(endpoint);
  if (projectId) client.setProject(projectId);
  if (apiKey) client.setKey(apiKey);
    
  const databases = new Databases(client);
  const storage = new Storage(client);
  
  return { client, databases, storage };
};
