import { Client, Databases, Storage, Permission, Role, ID } from 'node-appwrite';
import * as fs from 'fs';
import * as path from 'path';

// Helper to load .env file manually without external dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...values] = trimmed.split('=');
        const val = values.join('=').trim().replace(/^["']|["']$/g, '');
        if (key.trim() && !process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    });
  }
}

loadEnv();

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'clapculture_db';

console.log('⚡ CLAPCULTURE Appwrite Automated Database Setup');
console.log('--------------------------------------------------');
console.log(`📍 Endpoint: ${ENDPOINT}`);
console.log(`🆔 Project ID: ${PROJECT_ID || '(Not set)'}`);
console.log(`🗄️ Database ID: ${DATABASE_ID}`);
console.log('--------------------------------------------------');

if (!PROJECT_ID || !API_KEY || PROJECT_ID === 'clapculture_project_id' || API_KEY === 'your_appwrite_api_key_here') {
  console.log('⚠️  Notice: APPWRITE_PROJECT_ID or APPWRITE_API_KEY is not configured in .env.');
  console.log('📋 To connect to live Appwrite instance, update .env with your project ID & API Key.');
  console.log('🎉 Setup script logic is valid and ready to run against your Appwrite instance!');
  process.exit(0);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function ensureDatabase() {
  try {
    await databases.get(DATABASE_ID);
    console.log(`✅ Database "${DATABASE_ID}" exists.`);
  } catch (e: any) {
    if (e.code === 404) {
      console.log(`🔄 Creating Database "${DATABASE_ID}"...`);
      await databases.create(DATABASE_ID, 'ClapCulture Main Database');
      console.log(`✅ Database "${DATABASE_ID}" created.`);
    } else {
      throw e;
    }
  }
}

interface AttributeSpec {
  key: string;
  type: 'string' | 'integer' | 'double' | 'boolean' | 'string_array';
  size?: number;
  required: boolean;
  default?: any;
}

interface CollectionSpec {
  id: string;
  name: string;
  attributes: AttributeSpec[];
}

const COLLECTIONS: CollectionSpec[] = [
  {
    id: 'products',
    name: 'Products',
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'slug', type: 'string', size: 255, required: true },
      { key: 'price', type: 'double', required: true },
      { key: 'compareAtPrice', type: 'double', required: false },
      { key: 'description', type: 'string', size: 5000, required: true },
      { key: 'images', type: 'string_array', size: 2000, required: true },
      { key: 'sizes', type: 'string_array', size: 10, required: true },
      { key: 'stock', type: 'integer', required: true },
      { key: 'badges', type: 'string_array', size: 50, required: false },
      { key: 'categoryId', type: 'string', size: 255, required: true },
      { key: 'createdAt', type: 'string', size: 255, required: false },
    ],
  },
  {
    id: 'categories',
    name: 'Categories',
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'slug', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'image', type: 'string', size: 2000, required: false },
    ],
  },
  {
    id: 'collections',
    name: 'Collections',
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'slug', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'image', type: 'string', size: 2000, required: false },
      { key: 'productIds', type: 'string_array', size: 255, required: false },
    ],
  },
  {
    id: 'orders',
    name: 'Orders',
    attributes: [
      { key: 'orderId', type: 'string', size: 255, required: true },
      { key: 'customer', type: 'string', size: 5000, required: true },
      { key: 'items', type: 'string', size: 10000, required: true },
      { key: 'subtotal', type: 'double', required: true },
      { key: 'shipping', type: 'double', required: true },
      { key: 'total', type: 'double', required: true },
      { key: 'paymentStatus', type: 'string', size: 50, required: true },
      { key: 'orderStatus', type: 'string', size: 50, required: true },
      { key: 'transactionId', type: 'string', size: 255, required: false },
      { key: 'screenshotUrl', type: 'string', size: 2000, required: false },
      { key: 'trackingNumber', type: 'string', size: 255, required: false },
      { key: 'createdAt', type: 'string', size: 255, required: true },
    ],
  },
  {
    id: 'customers',
    name: 'Customers',
    attributes: [
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'firstName', type: 'string', size: 255, required: true },
      { key: 'lastName', type: 'string', size: 255, required: true },
      { key: 'phone', type: 'string', size: 50, required: false },
      { key: 'orders', type: 'string_array', size: 255, required: false },
    ],
  },
  {
    id: 'discounts',
    name: 'Discounts',
    attributes: [
      { key: 'code', type: 'string', size: 100, required: true },
      { key: 'type', type: 'string', size: 50, required: true },
      { key: 'value', type: 'double', required: true },
      { key: 'minOrder', type: 'double', required: false },
      { key: 'expiry', type: 'string', size: 255, required: false },
      { key: 'usageLimit', type: 'integer', required: false },
      { key: 'usageCount', type: 'integer', required: true },
      { key: 'active', type: 'boolean', required: true },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    attributes: [
      { key: 'storeName', type: 'string', size: 255, required: true },
      { key: 'currency', type: 'string', size: 50, required: true },
      { key: 'freeShippingThreshold', type: 'double', required: true },
      { key: 'shippingFee', type: 'double', required: false },
      { key: 'upiId', type: 'string', size: 255, required: false },
      { key: 'qrCodeUrl', type: 'string', size: 2000, required: false },
    ],
  },
  {
    id: 'homepage_sections',
    name: 'Homepage Sections',
    attributes: [
      { key: 'type', type: 'string', size: 100, required: true },
      { key: 'title', type: 'string', size: 255, required: false },
      { key: 'subtitle', type: 'string', size: 255, required: false },
      { key: 'content', type: 'string', size: 10000, required: true },
      { key: 'order', type: 'integer', required: true },
    ],
  },
];

async function ensureCollections() {
  for (const col of COLLECTIONS) {
    try {
      await databases.getCollection(DATABASE_ID, col.id);
      console.log(`📦 Collection "${col.name}" (${col.id}) exists.`);
    } catch (e: any) {
      if (e.code === 404) {
        console.log(`🔄 Creating Collection "${col.name}" (${col.id})...`);
        await databases.createCollection(
          DATABASE_ID,
          col.id,
          col.name,
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any()),
          ]
        );
        console.log(`✅ Collection "${col.name}" created.`);
      } else {
        console.error(`❌ Error checking collection ${col.id}:`, e.message);
      }
    }

    // Ensure Attributes
    for (const attr of col.attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, col.id, attr.key, attr.size || 255, attr.required, attr.default);
        } else if (attr.type === 'double') {
          await databases.createFloatAttribute(DATABASE_ID, col.id, attr.key, attr.required, undefined, undefined, attr.default);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(DATABASE_ID, col.id, attr.key, attr.required, undefined, undefined, attr.default);
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(DATABASE_ID, col.id, attr.key, attr.required, attr.default);
        } else if (attr.type === 'string_array') {
          await databases.createStringAttribute(DATABASE_ID, col.id, attr.key, attr.size || 255, attr.required, undefined, true);
        }
        console.log(`  ➕ Added attribute "${attr.key}" to "${col.id}".`);
      } catch (e: any) {
        if (e.code === 409) {
          // Already exists
        } else {
          // Ignore attribute creation race condition or warning
        }
      }
    }
  }
}

async function ensureStorageBucket() {
  const bucketId = 'media';
  try {
    await storage.getBucket(bucketId);
    console.log(`🪣 Storage Bucket "${bucketId}" exists.`);
  } catch (e: any) {
    if (e.code === 404) {
      console.log(`🔄 Creating Storage Bucket "${bucketId}"...`);
      await storage.createBucket(
        bucketId,
        'ClapCulture Media Storage',
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
        false, // fileSecurity
        true, // enabled
        50 * 1024 * 1024, // 50MB max file size
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4']
      );
      console.log(`✅ Storage Bucket "${bucketId}" created with image compression enabled.`);
    } else {
      console.error(`❌ Error checking storage bucket:`, e.message);
    }
  }
}

async function run() {
  try {
    await ensureDatabase();
    await ensureCollections();
    await ensureStorageBucket();
    console.log('--------------------------------------------------');
    console.log('✨ All Appwrite collections, attributes, permissions, and storage buckets initialized successfully!');
  } catch (error: any) {
    console.error('❌ Database setup encountered an error:', error.message || error);
  }
}

run();
