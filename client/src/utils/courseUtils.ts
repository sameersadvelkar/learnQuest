/**
 * Simple course folder mapping utility
 * Maps course IDs to their actual folder names
 */
export class CourseUtils {
  private static courseCache: Map<string | number, string> = new Map();

  /**
   * Get the folder name for a course ID
   * @param courseId - The course ID (numeric or string)
   * @returns Promise<string> - The course folder name
   */
  static async getCourseFolder(courseId: string | number): Promise<string> {
    const key = String(courseId);
    
    // Return cached result if available
    if (this.courseCache.has(key)) {
      return this.courseCache.get(key)!;
    }

    // Map course IDs to their actual folder names
    let folderName: string;
    if (courseId === 1 || courseId === '1') {
      folderName = 'digital-wellness-safety';
    } else if (courseId === 2 || courseId === '2') {
      folderName = 'example-course';
    } else {
      // Fallback to the course ID as folder name
      folderName = `course-${courseId}`;
    }
    
    this.courseCache.set(key, folderName);
    return folderName;
  }

  /**
   * Generate audio file path for a course
   * @param courseId - The course ID
   * @param pageId - Optional page ID
   * @param activityId - Optional activity ID
   * @returns Promise<string> - The complete audio file path
   */
  static async getAudioFilePath(
    courseId: string | number,
    pageId?: string,
    activityId?: string | number
  ): Promise<string> {
    const courseFolder = await this.getCourseFolder(courseId);
    
    if (activityId) {
      return `/courses/${courseFolder}/assets/audio/activity-${activityId}.mp3`;
    }
    if (pageId) {
      return `/courses/${courseFolder}/assets/audio/page-${pageId}.mp3`;
    }
    return `/courses/${courseFolder}/assets/audio/intro.mp3`;
  }

  /**
   * Clear the course folder cache (useful when courses are updated)
   */
  static clearCache(): void {
    this.courseCache.clear();
  }
}

export default CourseUtils;