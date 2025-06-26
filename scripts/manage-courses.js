#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coursesDir = path.resolve(__dirname, '../courses');

async function listCourses() {
  try {
    const entries = await fs.readdir(coursesDir, { withFileTypes: true });
    const courses = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    console.log('\n📚 Available Courses:');
    courses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course}`);
    });
    console.log('');
    return courses;
  } catch (error) {
    console.error('Error listing courses:', error.message);
    return [];
  }
}

async function removeCourse(courseName) {
  const coursePath = path.join(coursesDir, courseName);
  
  try {
    await fs.access(coursePath);
    await fs.rm(coursePath, { recursive: true, force: true });
    console.log(`✅ Course "${courseName}" removed successfully`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`❌ Course "${courseName}" not found`);
    } else {
      console.error('Error removing course:', error.message);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const courseName = args[1];

  switch (command) {
    case 'list':
      await listCourses();
      break;
      
    case 'remove':
      if (!courseName) {
        console.log('❌ Please specify a course name');
        console.log('Usage: node scripts/manage-courses.js remove <course-name>');
        return;
      }
      
      console.log(`🗑️  Removing course: ${courseName}`);
      await removeCourse(courseName);
      break;
      
    case 'help':
    default:
      console.log('\n📖 Course Management Commands:');
      console.log('  list                    - List all available courses');
      console.log('  remove <course-name>    - Remove a specific course');
      console.log('  help                    - Show this help message');
      console.log('\nExamples:');
      console.log('  node scripts/manage-courses.js list');
      console.log('  node scripts/manage-courses.js remove example-course');
      console.log('');
      break;
  }
}

main().catch(console.error);