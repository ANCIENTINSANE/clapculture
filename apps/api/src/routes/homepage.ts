import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { adminAuth } from '../middleware/auth';
import { Env } from '@clapculture/shared';

const homepage = new Hono<{ Bindings: Env }>();

homepage.get('/', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'homepage_sections'
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

homepage.put('/:section', adminAuth, async (c) => {
  try {
    const sectionName = c.req.param('section');
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    // find section
    const findSection = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'homepage_sections',
      [Query.equal('section', sectionName)]
    );
    
    let response;
    if (findSection.documents.length > 0) {
      response = await databases.updateDocument(
        c.env.APPWRITE_DATABASE_ID,
        'homepage_sections',
        findSection.documents[0].$id,
        { data: JSON.stringify(body) }
      );
    } else {
      response = await databases.createDocument(
        c.env.APPWRITE_DATABASE_ID,
        'homepage_sections',
        ID.unique(),
        { section: sectionName, data: JSON.stringify(body) }
      );
    }
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default homepage;
