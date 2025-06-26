#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coursesDir = path.resolve(__dirname, '../courses');
const dataDir = path.resolve(__dirname, '../data');

async function getExistingCourseFolders() {
  try {
    const entries = await fs.readdir(coursesDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    console.log('No courses directory found or error reading it');
    return [];
  }
}

async function cleanRemovedCourses() {
  try {
    // Get existing course folders
    const existingFolders = await getExistingCourseFolders();
    console.log('📁 Existing course folders:', existingFolders);
    
    // Read stored courses
    const coursesFilePath = path.join(dataDir, 'courses.json');
    const coursesData = await fs.readFile(coursesFilePath, 'utf-8');
    const storedCourses = JSON.parse(coursesData);
    
    console.log('💾 Stored courses:', storedCourses.map(c => `${c.id}: ${c.title} (${c.sourceIdentifier})`));
    
    // Filter out courses that no longer exist in file system
    const validCourses = storedCourses.filter(course => {
      if (course.sourceType === 'file_based' && course.sourceIdentifier) {
        const exists = existingFolders.includes(course.sourceIdentifier);
        if (!exists) {
          console.log(`🗑️  Removing course: ${course.title} (${course.sourceIdentifier})`);
        }
        return exists;
      }
      return true; // Keep non-file-based courses
    });
    
    // Update courses.json
    await fs.writeFile(coursesFilePath, JSON.stringify(validCourses, null, 2));
    console.log('✅ Updated courses.json');
    
    // Clean up related data files
    await cleanRelatedData(storedCourses, validCourses);
    
    console.log('🎉 Cleanup completed successfully');
    
  } catch (error) {
    console.error('❌ Error cleaning courses:', error.message);
  }
}

async function cleanRelatedData(oldCourses, newCourses) {
  const removedCourseIds = oldCourses
    .filter(old => !newCourses.find(n => n.id === old.id))
    .map(c => c.id);
  
  if (removedCourseIds.length === 0) {
    console.log('No courses were removed, no cleanup needed');
    return;
  }
  
  console.log('🧹 Cleaning related data for removed course IDs:', removedCourseIds);
  
  // Clean modules
  try {
    const modulesPath = path.join(dataDir, 'modules.json');
    const modulesData = await fs.readFile(modulesPath, 'utf-8');
    const modules = JSON.parse(modulesData);
    const filteredModules = modules.filter(m => !removedCourseIds.includes(m.courseId));
    await fs.writeFile(modulesPath, JSON.stringify(filteredModules, null, 2));
    console.log('✅ Cleaned modules.json');
  } catch (error) {
    console.log('⚠️  No modules.json found or error cleaning it');
  }
  
  // Clean activities
  try {
    const activitiesPath = path.join(dataDir, 'activities.json');
    const activitiesData = await fs.readFile(activitiesPath, 'utf-8');
    const activities = JSON.parse(activitiesData);
    
    // Get module IDs from removed courses
    const modulesPath = path.join(dataDir, 'modules.json');
    const modulesData = await fs.readFile(modulesPath, 'utf-8');
    const remainingModules = JSON.parse(modulesData);
    const validModuleIds = remainingModules.map(m => m.id);
    
    const filteredActivities = activities.filter(a => validModuleIds.includes(a.moduleId));
    await fs.writeFile(activitiesPath, JSON.stringify(filteredActivities, null, 2));
    console.log('✅ Cleaned activities.json');
  } catch (error) {
    console.log('⚠️  No activities.json found or error cleaning it');
  }
  
  // Clean user progress
  try {
    const progressPath = path.join(dataDir, 'userProgress.json');
    const progressData = await fs.readFile(progressPath, 'utf-8');
    const progress = JSON.parse(progressData);
    const filteredProgress = progress.filter(p => !removedCourseIds.includes(p.courseId));
    await fs.writeFile(progressPath, JSON.stringify(filteredProgress, null, 2));
    console.log('✅ Cleaned userProgress.json');
  } catch (error) {
    console.log('⚠️  No userProgress.json found or error cleaning it');
  }
}

cleanRemovedCourses().catch(console.error);