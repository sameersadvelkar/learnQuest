# File-Based Content Management System

This LMS uses a simple file-based content management system that allows developers to easily add courses, modules, activities, videos, and quizzes without needing a complex admin interface.

## Content Structure

```
client/src/data/content/
├── courses/
│   └── react-course/
│       ├── course.json
│       └── modules/
│           └── module-1/
│               ├── module.json
│               └── activities/
│                   ├── activity-1.json
│                   ├── activity-2.json
│                   ├── activity-3.json
│                   └── activity-4.json
```

## Adding New Content

### 1. Create a New Course

Create a folder under `client/src/data/content/courses/` with a `course.json` file:

```json
{
  "id": 1,
  "title": "React Mastery Course",
  "description": "Master React development from basics to advanced concepts",
  "totalModules": 3,
  "totalPages": 12,
  "estimatedDuration": 480,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "modules": ["module-1", "module-2", "module-3"]
}
```

### 2. Add Modules

Create a `modules/` folder with module subfolders, each containing a `module.json`:

```json
{
  "id": 1,
  "courseId": 1,
  "title": "Introduction to React",
  "description": "Learn the fundamentals of React",
  "orderIndex": 0,
  "totalActivities": 4,
  "isLocked": false,
  "activities": ["activity-1", "activity-2", "activity-3", "activity-4"]
}
```

### 3. Add Video Activities

Create activity JSON files for videos:

```json
{
  "id": 1,
  "moduleId": 1,
  "title": "What is React?",
  "description": "Introduction to React and its ecosystem",
  "type": "video",
  "orderIndex": 0,
  "content": null,
  "videoUrl": "https://youtube.com/watch?v=YOUR_VIDEO_ID",
  "duration": 15,
  "isLocked": false
}
```

### 4. Add Quiz Activities

Create quiz JSON files with questions:

```json
{
  "id": 4,
  "moduleId": 1,
  "title": "Module 1 Quiz",
  "description": "Test your knowledge of React basics",
  "type": "quiz",
  "orderIndex": 3,
  "duration": 10,
  "isLocked": false,
  "content": {
    "questions": [
      {
        "id": 1,
        "question": "What is React?",
        "type": "multiple_choice",
        "options": ["A JavaScript library", "A JavaScript framework", "A programming language", "A database"],
        "correct": 0,
        "explanation": "React is a JavaScript library for building user interfaces."
      },
      {
        "id": 2,
        "question": "React components must return a single parent element.",
        "type": "true_false",
        "correct": true,
        "explanation": "React components must return a single parent element or Fragment."
      }
    ]
  }
}
```

## Content Loader Integration

The content loader automatically discovers and loads your JSON files. Update `client/src/data/contentLoader.ts` to include new courses:

```typescript
// Add new course loading
await this.loadNewCourse();

private async loadNewCourse(): Promise<void> {
  // Add loading logic for your new course
}
```

## Supported Content Types

### Video Activities
- **videoUrl**: YouTube, Vimeo, or direct video file URLs
- **duration**: Length in minutes
- **type**: "video"

### Quiz Activities
- **Multiple Choice**: `type: "multiple_choice"` with options array
- **True/False**: `type: "true_false"` with boolean correct value
- **type**: "quiz"

### Reading Activities
- **type**: "reading"
- **content**: Rich text content or markdown

## Developer Workflow

1. **Add Content**: Create/edit JSON files
2. **Test**: Restart development server
3. **Version Control**: Commit JSON files to Git
4. **Deploy**: Files are automatically loaded

## Admin Capabilities

The admin interface focuses on student management:
- Assign courses to students
- Track progress and completion rates
- View time spent and performance metrics
- Export progress reports

Admins do not edit content - that's handled through the file system by developers.

## Benefits

- **Version Control**: All content is tracked in Git
- **No Database**: Content loads from files
- **Easy Collaboration**: Multiple developers can add content
- **Fast Setup**: No admin interface to build
- **Flexibility**: Easy to add new content types

## File Naming Conventions

- Course folders: `course-name` (kebab-case)
- Module folders: `module-1`, `module-2`, etc.
- Activity files: `activity-1.json`, `activity-2.json`, etc.
- IDs should be unique across all content