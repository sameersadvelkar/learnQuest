#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');

async function resetAllCourseData() {
  try {
    console.log('🔄 Resetting all course data...');
    
    // Clear all course-related data files
    const filesToClear = [
      'courses.json',
      'modules.json', 
      'activities.json',
      'userProgress.json',
      'schoolCourses.json',
      'studentCourses.json'
    ];
    
    for (const file of filesToClear) {
      const filePath = path.join(dataDir, file);
      try {
        await fs.writeFile(filePath, '[]');
        console.log(`✅ Cleared ${file}`);
      } catch (error) {
        console.log(`⚠️ Could not clear ${file}: ${error.message}`);
      }
    }
    
    // Reset counters
    const countersPath = path.join(dataDir, 'counters.json');
    const resetCounters = {
      currentSchoolId: 1,
      currentUserId: 2, // Keep admin user
      currentCourseId: 1,
      currentModuleId: 1,
      currentActivityId: 1,
      currentSchoolCourseId: 1,
      currentStudentCourseId: 1,
      currentProgressId: 1,
      currentAchievementId: 3, // Keep existing achievements
      currentUserAchievementId: 1,
      currentUserSettingsId: 1,
      currentCourseTranslationId: 1
    };
    
    await fs.writeFile(countersPath, JSON.stringify(resetCounters, null, 2));
    console.log('✅ Reset counters.json');
    
    console.log('🎉 Course data reset complete. Restart the application to reload courses from file system.');
    
  } catch (error) {
    console.error('❌ Error resetting course data:', error.message);
  }
}

resetAllCourseData().catch(console.error);