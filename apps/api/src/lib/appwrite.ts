import { Client, Databases, Storage } from 'node-appwrite';
import { Env } from '@clapculture/shared';

export const getAppwriteClient = (env: Env) => {
  const client = new Client();
  client
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);
    
  const databases = new Databases(client);
  const storage = new Storage(client);
  
  return { client, databases, storage };
};
