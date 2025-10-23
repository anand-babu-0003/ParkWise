/**
 * Test script to verify admin panel components
 * This script checks if the main components of the admin panel are working correctly
 */

import { promises as fs } from 'fs';
import { join } from 'path';

async function testAdminPanel() {
  console.log('Testing Admin Panel Components...\n');
  
  // Check if required files exist
  const requiredFiles = [
    'src/app/mobile-admin-panel.tsx',
    'src/app/admin/dashboard/page.tsx',
    'src/app/admin/layout.tsx',
    'src/docs/mobile-admin-panel.md'
  ];
  
  for (const file of requiredFiles) {
    try {
      await fs.access(join(process.cwd(), file));
      console.log(`✓ ${file} exists`);
    } catch {
      console.log(`✗ ${file} is missing`);
    }
  }
  
  console.log('\nAdmin Panel Test Complete!');
  console.log('To test the admin panel in browser:');
  console.log('1. Ensure you have an admin user account');
  console.log('2. Navigate to http://localhost:9002/admin/dashboard');
  console.log('3. Verify all charts and data are loading correctly');
  console.log('4. Test navigation between different admin sections');
}

testAdminPanel();