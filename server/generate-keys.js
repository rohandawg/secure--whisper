#!/usr/bin/env node

/**
 * Helper script to generate secure keys for deployment
 * Usage: node generate-keys.js
 */

import crypto from 'crypto';

console.log('\n🔐 Generating Secure Keys for SecureChat Deployment\n');
console.log('='.repeat(60));

// Generate JWT Secret (32+ characters recommended)
const jwtSecret = crypto.randomBytes(32).toString('base64');
console.log('\n📝 JWT_SECRET (for authentication):');
console.log(jwtSecret);
console.log('\n   Length:', jwtSecret.length, 'characters');

// Generate Encryption Key (exactly 32 bytes for AES-256-GCM)
const encryptionKey = crypto.randomBytes(32).toString('base64');
console.log('\n🔒 ENCRYPTION_KEY (32 bytes for AES-256-GCM):');
console.log(encryptionKey);
console.log('\n   Length:', Buffer.from(encryptionKey, 'base64').length, 'bytes');

console.log('\n' + '='.repeat(60));
console.log('\n✅ Copy these values to your Render environment variables:');
console.log('\n   Backend Service → Environment → Add:');
console.log('   - JWT_SECRET =', jwtSecret);
console.log('   - ENCRYPTION_KEY =', encryptionKey);
console.log('\n⚠️  Keep these secrets secure! Never commit them to git.\n');

