import { PageContent } from '@shared/schema';

export const whatIsReactContent: PageContent = {
  title: 'What is React?',
  description: 'Introduction to React and its ecosystem',
  type: 'video',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  objectives: [
    'Understand what React is and why it\'s useful',
    'Learn about the React ecosystem',
    'Recognize the benefits of component-based architecture',
    'Identify when to use React in your projects'
  ],
  content: [
    {
      type: 'text',
      title: 'What is React?',
      content: 'React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook and is now maintained by Meta and the open-source community.'
    },
    {
      type: 'text',
      title: 'Key Features',
      content: 'React focuses on creating reusable UI components, uses a virtual DOM for efficient updates, and follows a declarative programming paradigm.'
    },
    {
      type: 'list',
      title: 'React Benefits',
      content: 'Component-based architecture\nVirtual DOM for performance\nUnidirectional data flow\nLarge ecosystem and community\nBacked by Meta (Facebook)'
    },
    {
      type: 'code',
      title: 'Simple React Component',
      content: 'function Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n// Usage\n<Welcome name="World" />',
      language: 'javascript'
    }
  ],
  resources: [
    {
      title: 'Official React Documentation',
      url: 'https://react.dev',
      type: 'link'
    },
    {
      title: 'React Getting Started Guide',
      url: '/resources/react-getting-started.pdf',
      type: 'pdf'
    },
    {
      title: 'Component Architecture Patterns',
      url: '/resources/component-patterns.pdf',
      type: 'document'
    }
  ]
};
