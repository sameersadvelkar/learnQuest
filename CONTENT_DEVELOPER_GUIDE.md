# Content Developer Guide

This guide provides comprehensive examples of all supported content types and structures for the educational LMS platform.

## File Structure

```
courses/
├── [course-folder]/
│   ├── course.json
│   └── modules/
│       ├── [module-folder]/
│       │   ├── module.json
│       │   └── activities/
│       │       ├── activity-1.json
│       │       ├── activity-2.json
│       │       └── ...
│       └── ...
```

## Course Configuration

### course.json
```json
{
  "id": 1,
  "title": "Course Title",
  "description": "Course description",
  "totalModules": 3,
  "totalPages": 12,
  "estimatedDuration": 480,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "modules": ["module-1", "module-2", "module-3"]
}
```

## Module Configuration

### module.json
```json
{
  "id": 1,
  "courseId": 1,
  "title": "Module Title",
  "description": "Module description",
  "orderIndex": 0,
  "totalActivities": 4,
  "isLocked": false,
  "activities": ["activity-1", "activity-2", "activity-3", "activity-4"]
}
```

## Activity Types & Examples

### 1. Video Activity

```json
{
  "id": 1,
  "moduleId": 1,
  "title": "Introduction to React",
  "description": "Learn the basics of React",
  "type": "video",
  "orderIndex": 0,
  "content": null,
  "videoUrl": "https://example.com/video.mp4",
  "duration": 15,
  "isLocked": false
}
```

### 2. Reading Activity with Tabbed Content

```json
{
  "id": 2,
  "moduleId": 1,
  "title": "Component Fundamentals",
  "description": "Theory with interactive tabs",
  "type": "reading",
  "orderIndex": 1,
  "duration": 15,
  "isLocked": false,
  "content": {
    "type": "tabbed_content",
    "tabs": [
      {
        "id": "overview",
        "title": "Overview",
        "content": {
          "type": "markdown",
          "text": "# Component Fundamentals\n\nReact components are..."
        }
      },
      {
        "id": "examples",
        "title": "Examples",
        "content": {
          "type": "code_example",
          "language": "jsx",
          "code": "function Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}"
        }
      }
    ]
  }
}
```

### 3. Quiz Activity - Multiple Question Types

```json
{
  "id": 3,
  "moduleId": 1,
  "title": "Knowledge Check",
  "description": "Test your understanding",
  "type": "quiz",
  "orderIndex": 2,
  "duration": 10,
  "isLocked": false,
  "content": {
    "type": "quiz",
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "What are React components?",
        "options": ["Functions that return JSX", "HTML templates", "CSS classes"],
        "correctAnswer": 0,
        "explanation": "React components are JavaScript functions that return JSX."
      },
      {
        "id": "q2",
        "type": "true_false",
        "question": "Props can be modified by components.",
        "correctAnswer": false,
        "explanation": "Props are read-only in React."
      },
      {
        "id": "q3",
        "type": "multiple_select",
        "question": "Valid prop types include:",
        "options": ["String", "Number", "Function", "Object"],
        "correctAnswers": [0, 1, 2, 3],
        "explanation": "All JavaScript data types can be props."
      },
      {
        "id": "q4",
        "type": "fill_in_blank",
        "question": "Complete: function Welcome({name}) { return <h1>Hello, ___!</h1>; }",
        "correctAnswer": "{name}",
        "placeholder": "Enter JSX expression",
        "explanation": "Use {name} to display the prop value."
      },
      {
        "id": "q5",
        "type": "code_completion",
        "question": "Complete this component:",
        "codeTemplate": "function UserInfo({ user }) {\n  return (\n    <div>\n      <h2>___</h2>\n      <p>Age: ___</p>\n    </div>\n  );\n}",
        "blanks": [
          {
            "id": "blank1",
            "correctAnswer": "{user.name}",
            "placeholder": "Display name"
          },
          {
            "id": "blank2",
            "correctAnswer": "{user.age}",
            "placeholder": "Display age"
          }
        ],
        "explanation": "Use JSX expressions to access object properties."
      },
      {
        "id": "q6",
        "type": "drag_and_drop",
        "question": "Arrange component parts in order:",
        "items": [
          { "id": "1", "text": "function ComponentName" },
          { "id": "2", "text": "({ props })" },
          { "id": "3", "text": "return" },
          { "id": "4", "text": "(<JSX />);" }
        ],
        "correctOrder": ["1", "2", "3", "4"],
        "explanation": "Components follow: function, parameters, return, JSX."
      }
    ],
    "passingScore": 70,
    "timeLimit": 600,
    "allowRetakes": true,
    "showCorrectAnswers": true
  }
}
```

### 4. Interactive Activity - Step by Step

```json
{
  "id": 4,
  "moduleId": 1,
  "title": "Component Builder",
  "description": "Build components step by step",
  "type": "interactive",
  "orderIndex": 3,
  "duration": 20,
  "isLocked": false,
  "content": {
    "type": "step_by_step",
    "steps": [
      {
        "id": "step1",
        "title": "Create Function",
        "description": "Start with a basic function component",
        "content": {
          "type": "code_editor",
          "language": "jsx",
          "initialCode": "// Create a function component\n",
          "solution": "function Greeting() {\n  \n}",
          "hints": ["Use 'function' keyword", "Capitalize component name"]
        }
      }
    ],
    "completionCriteria": {
      "allStepsCompleted": true,
      "codeCompiles": true
    }
  }
}
```

### 5. Assignment Activity

```json
{
  "id": 5,
  "moduleId": 1,
  "title": "Portfolio Component",
  "description": "Create a portfolio component",
  "type": "assignment",
  "orderIndex": 4,
  "duration": 45,
  "isLocked": false,
  "content": {
    "type": "assignment",
    "title": "Portfolio Component Challenge",
    "instructions": "Create a portfolio component showcasing skills and projects.",
    "requirements": [
      {
        "id": "req1",
        "text": "Create functional component called 'Portfolio'",
        "points": 15
      },
      {
        "id": "req2",
        "text": "Accept props for name, title, skills, projects",
        "points": 20
      }
    ],
    "starterCode": "function Portfolio() {\n  // Your code here\n}",
    "sampleData": {
      "name": "Alex Johnson",
      "title": "Frontend Developer",
      "skills": ["JavaScript", "React", "CSS"],
      "projects": [
        {
          "title": "Weather App",
          "description": "Responsive weather application"
        }
      ]
    },
    "rubric": {
      "excellent": "90-100 points: All requirements met with clean code",
      "good": "80-89 points: Most requirements met",
      "satisfactory": "70-79 points: Basic requirements met",
      "needsWork": "Below 70 points: Missing key requirements"
    },
    "submissionFormat": "Upload .jsx file",
    "allowLateSubmission": true
  }
}
```

### 6. Lab Activity - Multi-Section

```json
{
  "id": 6,
  "moduleId": 1,
  "title": "Advanced Patterns Lab",
  "description": "Hands-on practice with patterns",
  "type": "lab",
  "orderIndex": 5,
  "duration": 35,
  "isLocked": false,
  "content": {
    "type": "multi_section",
    "sections": [
      {
        "id": "theory",
        "title": "Theory",
        "content": {
          "type": "markdown",
          "text": "# Advanced Patterns\n\nExplore advanced component patterns..."
        }
      },
      {
        "id": "practice",
        "title": "Practice",
        "content": {
          "type": "code_sandbox",
          "exercises": [
            {
              "id": "ex1",
              "title": "Modal Component",
              "description": "Build reusable modal",
              "starterCode": "function Modal({ children }) {\n  // Implementation\n}",
              "solution": "function Modal({ isOpen, onClose, children }) {\n  if (!isOpen) return null;\n  return (\n    <div className=\"modal-overlay\" onClick={onClose}>\n      <div className=\"modal-content\">{children}</div>\n    </div>\n  );\n}",
              "tests": ["Modal renders when open", "Modal hides when closed"]
            }
          ]
        }
      }
    ],
    "completionCriteria": {
      "sectionsCompleted": ["theory", "practice"],
      "exercisesCompleted": 1
    }
  }
}
```

### 7. Presentation Activity - Slideshow

```json
{
  "id": 7,
  "moduleId": 1,
  "title": "Understanding State",
  "description": "Interactive presentation on React state",
  "type": "presentation",
  "orderIndex": 0,
  "duration": 20,
  "isLocked": false,
  "content": {
    "type": "slideshow",
    "slides": [
      {
        "id": "slide1",
        "title": "What is State?",
        "content": {
          "type": "split_layout",
          "left": {
            "type": "markdown",
            "text": "# React State\n\nState is data that changes over time..."
          },
          "right": {
            "type": "code_example",
            "language": "jsx",
            "code": "const [count, setCount] = useState(0);"
          }
        }
      },
      {
        "id": "slide2",
        "title": "Interactive Demo",
        "content": {
          "type": "interactive_demo",
          "demo": {
            "type": "live_code",
            "initialCode": "function Toggle() {\n  const [isOn, setIsOn] = useState(false);\n  return <button onClick={() => setIsOn(!isOn)}>{isOn ? 'ON' : 'OFF'}</button>;\n}",
            "editable": true,
            "showPreview": true
          },
          "explanation": "Try modifying the code above!"
        }
      }
    ],
    "navigation": {
      "showProgress": true,
      "allowSkip": false
    }
  }
}
```

### 8. Exercise Activity - Guided Practice

```json
{
  "id": 8,
  "moduleId": 1,
  "title": "State Practice",
  "description": "Hands-on state management exercises",
  "type": "exercise",
  "orderIndex": 1,
  "duration": 30,
  "isLocked": false,
  "content": {
    "type": "guided_exercise",
    "exercises": [
      {
        "id": "ex1",
        "title": "Shopping Cart",
        "difficulty": "Beginner",
        "description": "Create shopping cart with add/remove",
        "instructions": ["Create state for items", "Add function to add items", "Display total"],
        "starterCode": "function ShoppingCart() {\n  // TODO: Add state\n}",
        "solution": "function ShoppingCart() {\n  const [items, setItems] = useState([]);\n  // Full implementation\n}",
        "hints": ["Use useState for array", "Use map to update items"]
      }
    ],
    "completionCriteria": {
      "exercisesCompleted": 1,
      "codeExecuted": true
    }
  }
}
```

### 9. Assessment Activity - Comprehensive Testing

```json
{
  "id": 9,
  "moduleId": 1,
  "title": "State Management Assessment",
  "description": "Comprehensive assessment",
  "type": "assessment",
  "orderIndex": 2,
  "duration": 25,
  "isLocked": false,
  "content": {
    "type": "assessment",
    "questions": [
      {
        "id": "q1",
        "type": "scenario_based",
        "scenario": "Component manages user list. Delete should remove user.",
        "question": "Which approach correctly removes a user?",
        "options": ["users.splice(index, 1)", "setUsers(users.filter(u => u.id !== id))"],
        "correctAnswer": 1,
        "explanation": "Filter creates new array without mutation.",
        "points": 10
      },
      {
        "id": "q2",
        "type": "code_analysis",
        "code": "const increment = () => {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n};",
        "question": "What happens when called?",
        "options": ["Increases by 3", "Increases by 1"],
        "correctAnswer": 1,
        "explanation": "All calls use same stale value.",
        "points": 15
      }
    ],
    "timeLimit": 1500,
    "passingScore": 60,
    "certificateEligible": true
  }
}
```

### 10. Simulation Activity - Interactive Scenarios

```json
{
  "id": 10,
  "moduleId": 1,
  "title": "Event Handling Workshop",
  "description": "Interactive event handling practice",
  "type": "simulation",
  "orderIndex": 3,
  "duration": 40,
  "isLocked": false,
  "content": {
    "type": "interactive_simulation",
    "scenarios": [
      {
        "id": "scenario1",
        "title": "Click Events",
        "description": "Handle click events and state updates",
        "setup": {
          "initialCode": "function Counter() {\n  const [count, setCount] = useState(0);\n  // Add click handler\n}",
          "objective": "Make button increment counter",
          "hints": ["Add onClick prop", "Create handler function"]
        },
        "solution": "function Counter() {\n  const [count, setCount] = useState(0);\n  const handleClick = () => setCount(count + 1);\n  return <button onClick={handleClick}>Count: {count}</button>;\n}",
        "tests": ["Button has onClick", "Clicking increments count"]
      }
    ],
    "progressTracking": {
      "trackCompletions": true,
      "showProgress": true
    },
    "completionCriteria": {
      "scenariosCompleted": 1,
      "allTestsPassed": true
    }
  }
}
```

### 11. Project Activity - Capstone

```json
{
  "id": 11,
  "moduleId": 1,
  "title": "Task Manager Project",
  "description": "Build complete task management app",
  "type": "project",
  "orderIndex": 4,
  "duration": 60,
  "isLocked": false,
  "content": {
    "type": "capstone_project",
    "title": "Task Manager Application",
    "overview": "Build complete task management demonstrating React mastery.",
    "objectives": ["Implement state management", "Handle events", "Create UI", "Apply best practices"],
    "requirements": {
      "core_features": [
        {
          "feature": "Task Creation",
          "description": "Add tasks with validation",
          "acceptance_criteria": ["Form validation", "Immediate display", "Priority levels"],
          "points": 20
        }
      ],
      "bonus_features": [
        {
          "feature": "Due Dates",
          "description": "Add deadline functionality",
          "points": 10
        }
      ]
    },
    "starter_template": {
      "structure": "task-manager/\n├── components/\n├── hooks/\n└── App.jsx",
      "initial_code": "function App() {\n  const [tasks, setTasks] = useState([]);\n  // Implementation needed\n}"
    },
    "evaluation_criteria": {
      "code_quality": { "weight": 30, "criteria": ["Clean code", "Component separation"] },
      "functionality": { "weight": 40, "criteria": ["Features work", "Error handling"] }
    },
    "milestones": [
      {
        "milestone": "Basic Structure",
        "deadline": "Day 1",
        "deliverables": ["Component setup", "Basic UI"]
      }
    ],
    "submission": {
      "format": "GitHub repository",
      "requirements": ["README", "Documentation"],
      "grading_scale": {
        "A": "90-100 points - Exceptional work",
        "B": "80-89 points - Solid implementation"
      }
    }
  }
}
```

## Content Type Reference

### Supported Activity Types
- `video` - Video lessons with completion tracking
- `reading` - Text content with markdown support and tabs
- `quiz` - Interactive quizzes with multiple question types
- `interactive` - Step-by-step coding exercises
- `assignment` - Graded assignments with rubrics
- `lab` - Multi-section hands-on practice
- `presentation` - Interactive slideshows
- `exercise` - Guided coding practice
- `assessment` - Comprehensive evaluations
- `simulation` - Interactive scenario-based learning
- `project` - Capstone projects with detailed requirements

### Question Types for Quizzes
- `multiple_choice` - Single correct answer
- `true_false` - Boolean questions
- `multiple_select` - Multiple correct answers
- `fill_in_blank` - Text input completion
- `code_completion` - Fill in code blanks
- `drag_and_drop` - Arrange items in order
- `scenario_based` - Context-driven questions
- `code_analysis` - Analyze code snippets
- `matching` - Match items between columns
- `debugging` - Identify and fix code issues
- `performance` - Optimization questions

### Content Layout Types
- `markdown` - Rich text with markdown syntax
- `code_example` - Syntax-highlighted code blocks
- `tabbed_content` - Multiple tabs with different content
- `split_layout` - Side-by-side content areas
- `interactive_demo` - Live code editors
- `comparison` - Side-by-side comparisons
- `step_by_step` - Sequential learning steps
- `multi_section` - Multiple content sections
- `slideshow` - Presentation slides
- `guided_exercise` - Structured practice
- `code_sandbox` - Interactive coding environment

## Best Practices

1. **File Organization**: Keep folder names descriptive and consistent
2. **Content Structure**: Use appropriate content types for learning objectives
3. **Progressive Difficulty**: Order activities from simple to complex
4. **Clear Instructions**: Provide detailed descriptions and hints
5. **Interactive Elements**: Include hands-on practice and assessments
6. **Multimedia Balance**: Mix videos, text, and interactive content
7. **Assessment Alignment**: Match quiz questions to learning goals
8. **Code Examples**: Provide working, tested code samples
9. **Error Handling**: Include validation and error scenarios
10. **Accessibility**: Consider different learning styles and abilities

This guide provides developers with comprehensive examples for creating rich, interactive educational content that supports various learning styles and educational objectives.