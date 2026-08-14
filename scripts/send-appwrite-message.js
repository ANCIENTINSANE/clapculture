#!/usr/bin/env node

/**
 * CLAPCULTURE — Dispatch Email via Appwrite Messaging Service
 * Usage:
 *   node scripts/send-appwrite-message.js --to=user@example.com --subject="Test Message"
 */

const fs = require('fs');
const path = require('path');
const { Client, Messaging, Users, ID } = require('node-appwrite');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key) {
          process.env[key.trim()] = values.join('=').trim();
        }
      }
    });
  }
}

loadEnv();

const args = process.argv.slice(2);
let targetEmail = process.env.SMTP_USER || 'clapculture.co@gmail.com';
let subject = '[CLAPCULTURE] Appwrite Messaging Live Transmission';

args.forEach((arg) => {
  if (arg.startsWith('--to=')) {
    targetEmail = arg.split('=')[1];
  }
  if (arg.startsWith('--subject=')) {
    subject = arg.split('=')[1];
  }
});

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6a7dfa97003713198186';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const messaging = new Messaging(client);
const users = new Users(client);

async function sendAppwriteEmail() {
  console.log('\n======================================================');
  console.log('⚡ CLAPCULTURE — APPWRITE MESSAGING DISPATCH');
  console.log('======================================================');
  console.log(`Endpoint:         ${APPWRITE_ENDPOINT}`);
  console.log(`Project ID:       ${APPWRITE_PROJECT_ID}`);
  console.log(`Recipient:        ${targetEmail}`);
  console.log(`Subject:          ${subject}`);
  console.log('------------------------------------------------------');
  console.log('🔄 Checking Appwrite user targets for recipient...');

  let targetUserId;

  try {
    // Check if user already exists in Appwrite Auth
    const userList = await users.list();
    const existing = userList.users.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase());

    if (existing) {
      targetUserId = existing.$id;
      console.log(`   Found existing Appwrite user: ${existing.name || existing.email} [ID: ${targetUserId}]`);
    } else {
      console.log(`   Creating customer recipient record in Appwrite...`);
      const newUser = await users.create(
        ID.unique(),
        targetEmail,
        undefined,
        undefined,
        'Valued Rebel'
      );
      targetUserId = newUser.$id;
      console.log(`   Created Appwrite recipient [ID: ${targetUserId}]`);
    }

    const htmlContent = `
      <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 30px; border-radius: 8px;">
        <h1 style="color: #d2f000; font-size: 28px; margin: 0 0 10px 0; text-transform: uppercase;">CLAPCULTURE</h1>
        <div style="font-size: 10px; background-color: #d2f000; color: #000; display: inline-block; padding: 3px 8px; font-weight: bold; margin-bottom: 20px;">APPWRITE MESSAGING DISPATCH</div>
        <p style="font-size: 16px; color: #e5e5e5; line-height: 1.6;">
          This message was logged and dispatched directly via <strong>Appwrite Cloud Messaging</strong> connected to your Gmail SMTP provider!
        </p>
        <div style="background-color: #121212; border: 1px solid #262626; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <div style="color: #737373; font-size: 11px; font-family: monospace;">MESSAGE ID: ${ID.unique()}</div>
          <div style="color: #d2f000; font-size: 14px; font-weight: bold; margin-top: 4px;">VERIFIED & ACTIVE</div>
        </div>
        <p style="font-size: 12px; color: #737373;">
          © ${new Date().getFullYear()} CLAPCULTURE | Developed by surendra.codes
        </p>
      </div>
    `;

    console.log('🔄 Creating message in Appwrite Messaging...');
    const message = await messaging.createEmail(
      ID.unique(),
      subject,
      htmlContent,
      [], // topics
      [targetUserId], // users
      [], // targets
      [], // cc
      [], // bcc
      [], // attachments
      false, // draft = false (send immediately)
      true // html = true
    );

    console.log('\n✅ APPWRITE MESSAGE CREATED & DISPATCHED SUCCESSFULLY!');
    console.log(`   Message ID:    ${message.$id}`);
    console.log(`   Status:        ${message.status || 'SENT'}`);
    console.log(`   Subject:       ${message.data?.subject || subject}`);
    console.log('\n🎉 You can now refresh the "Messages" tab in your Appwrite Console to see this message!\n');
  } catch (error) {
    console.error('\n⚠️ Appwrite Messaging Note:');
    console.error(`   ${error.message}`);
  }
}

sendAppwriteEmail();
