import { CourseUtils } from './courseUtils';

export async function getAudioFile(courseId: string | number, pageType: 'intro' | 'activity', activityId?: string | number, language: string = 'en'): Promise<string | null> {
  try {
    const courseFolder = await CourseUtils.getCourseFolder(courseId);
    const basePath = `/courses/${courseFolder}/assets/audio`;
    
    if (pageType === 'intro') {
      return `${basePath}/${language}/intro.mp3`;
    } else if (activityId) {
      return `${basePath}/${language}/activity-${activityId}.mp3`;
    }

    return null;
  } catch (error) {
    console.warn(`Failed to get audio file for course ${courseId}:`, error);
    return null;
  }
}