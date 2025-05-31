import { PageContent } from '@shared/schema';

export const propsInDetailContent: PageContent = {
  title: 'Props in Detail',
  description: 'Learn how to pass data between React components using props and understand prop types.',
  type: 'video',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  objectives: [
    'Understand what props are in React',
    'Learn how to pass props to components',
    'Implement prop validation with PropTypes',
    'Practice destructuring props for cleaner code'
  ],
  content: [
    {
      type: 'text',
      title: 'What are Props?',
      content: 'Props (short for properties) are how components receive data from their parent components. They are read-only and help make components reusable by allowing them to render different data.'
    },
    {
      type: 'code',
      title: 'Basic Props Example',
      content: 'function Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n// Usage\n<Welcome name="Alice" />\n<Welcome name="Bob" />',
      language: 'javascript'
    },
    {
      type: 'text',
      title: 'Props are Read-Only',
      content: 'Props should never be modified by the receiving component. They represent immutable data passed down from parent to child.'
    },
    {
      type: 'code',
      title: 'Destructuring Props',
      content: 'function Welcome({ name, age }) {\n  return (\n    <div>\n      <h1>Hello, {name}!</h1>\n      <p>You are {age} years old.</p>\n    </div>\n  );\n}\n\n// Usage\n<Welcome name="Alice" age={25} />',
      language: 'javascript'
    },
    {
      type: 'code',
      title: 'Props with Default Values',
      content: 'function Button({ text = "Click me", type = "button" }) {\n  return <button type={type}>{text}</button>;\n}\n\n// Usage\n<Button />  // Uses defaults\n<Button text="Submit" type="submit" />',
      language: 'javascript'
    }
  ],
  resources: [
    {
      title: 'React Props Documentation',
      url: 'https://react.dev/learn/passing-props-to-a-component',
      type: 'link'
    },
    {
      title: 'PropTypes Cheat Sheet',
      url: '/resources/proptypes-cheat-sheet.pdf',
      type: 'pdf'
    }
  ],
  quiz: {
    questions: [
      {
        id: 'props-basic-1',
        question: 'Which of the following is the correct way to pass a prop called "username" with the value "john" to a component called UserProfile?',
        type: 'multiple-choice',
        options: [
          '<UserProfile username=john />',
          '<UserProfile username="john" />',
          '<UserProfile {username: "john"} />',
          '<UserProfile props.username="john" />'
        ],
        correctAnswer: 1,
        explanation: 'Props are passed as attributes with string values in quotes. Option B correctly passes the username prop with the value "john".'
      },
      {
        id: 'props-basic-2',
        question: 'Can a component modify the props it receives?',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'false',
        explanation: 'Props are read-only and should never be modified by the receiving component. This helps maintain unidirectional data flow.'
      },
      {
        id: 'props-destructuring',
        question: 'What is the benefit of destructuring props in the function parameter?',
        type: 'multiple-choice',
        options: [
          'It makes the code run faster',
          'It makes the code more readable and cleaner',
          'It is required by React',
          'It prevents bugs'
        ],
        correctAnswer: 1,
        explanation: 'Destructuring props in the function parameter makes the code more readable by clearly showing which props the component expects to receive.'
      }
    ]
  }
};
