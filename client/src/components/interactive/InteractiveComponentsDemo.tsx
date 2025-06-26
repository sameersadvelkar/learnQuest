import { 
  FlipCard, 
  InteractiveAccordion, 
  InteractiveSlider, 
  InteractiveTabs, 
  DragDropAssessment, 
  MultipleChoiceAssessment 
} from './index';

export function InteractiveComponentsDemo() {
  // Sample data for all components
  const flipCardData = [
    {
      frontText: "What is React?",
      backText: "React is a JavaScript library for building user interfaces, particularly web applications. It was developed by Facebook and allows developers to create reusable UI components.",
      triggerMode: 'hover' as const
    },
    {
      frontText: "JavaScript Fundamentals", 
      backText: "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It's a core technology of the World Wide Web.",
      triggerMode: 'click' as const
    }
  ];

  const accordionData = [
    {
      id: '1',
      title: 'What is Component-Based Architecture?',
      content: 'Component-based architecture is a software design paradigm where applications are built as a collection of loosely coupled, reusable components. Each component encapsulates its own logic, state, and presentation.\n\nThis approach promotes code reusability, maintainability, and modularity. Components can be independently developed, tested, and deployed.'
    },
    {
      id: '2', 
      title: 'Understanding State Management',
      content: 'State management refers to how an application handles and updates data that can change over time. In React, state represents the data that components need to render and respond to user interactions.\n\nProper state management ensures your UI stays in sync with your data and provides a smooth user experience.'
    },
    {
      id: '3',
      title: 'Props vs State',
      content: 'Props (properties) are read-only data passed from parent to child components, while state is mutable data managed within a component.\n\nProps enable component communication and customization, while state allows components to be interactive and dynamic.'
    }
  ];

  const sliderData = [
    {
      id: 'slide1',
      title: 'Introduction to Hooks',
      content: 'React Hooks allow you to use state and other React features in functional components. They were introduced in React 16.8 and have revolutionized how we write React applications.\n\nHooks provide a more direct API to React concepts you already know: props, state, context, refs, and lifecycle.'
    },
    {
      id: 'slide2', 
      title: 'useState Hook',
      content: 'The useState Hook lets you add state to functional components. It returns an array with two elements: the current state value and a setter function.\n\nExample: const [count, setCount] = useState(0);'
    },
    {
      id: 'slide3',
      title: 'useEffect Hook', 
      content: 'The useEffect Hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.\n\nUse it for data fetching, setting up subscriptions, and manually changing the DOM.'
    }
  ];

  const tabData = [
    {
      id: 'basics',
      label: 'React Basics',
      content: 'React is built around the concept of components. Components are JavaScript functions or classes that return JSX (JavaScript XML) to describe what should appear on the screen.\n\nJSX allows you to write HTML-like syntax in your JavaScript code, making it easier to create and visualize your UI structure.'
    },
    {
      id: 'advanced',
      label: 'Advanced Concepts', 
      content: 'Advanced React concepts include Context API for state management, Higher-Order Components (HOCs) for code reuse, Render Props pattern, and performance optimization techniques.\n\nThese patterns help you build more maintainable and efficient React applications at scale.'
    },
    {
      id: 'ecosystem',
      label: 'React Ecosystem',
      content: 'The React ecosystem includes tools like React Router for navigation, Redux or Zustand for state management, and testing libraries like Jest and React Testing Library.\n\nBuild tools like Create React App, Vite, and Next.js provide different approaches to setting up and deploying React applications.'
    }
  ];

  const dragDropData = {
    title: 'React Concepts Sorting',
    instructions: 'Drag each concept to the correct category below.',
    items: [
      { id: 'useState', content: 'useState', correctZone: 'hooks' },
      { id: 'component', content: 'Component', correctZone: 'core' },
      { id: 'useEffect', content: 'useEffect', correctZone: 'hooks' },
      { id: 'jsx', content: 'JSX', correctZone: 'core' },
      { id: 'redux', content: 'Redux', correctZone: 'ecosystem' },
      { id: 'router', content: 'React Router', correctZone: 'ecosystem' }
    ],
    zones: [
      { id: 'core', label: 'Core React', acceptsItems: ['component', 'jsx'] },
      { id: 'hooks', label: 'React Hooks', acceptsItems: ['useState', 'useEffect'] },
      { id: 'ecosystem', label: 'React Ecosystem', acceptsItems: ['redux', 'router'] }
    ]
  };

  const multipleChoiceData = {
    title: 'React Knowledge Quiz',
    questions: [
      {
        id: 'q1',
        question: 'Which of the following are React Hooks?',
        type: 'multiple' as const,
        options: [
          { id: 'a', text: 'useState', isCorrect: true },
          { id: 'b', text: 'useEffect', isCorrect: true },
          { id: 'c', text: 'componentDidMount', isCorrect: false },
          { id: 'd', text: 'useContext', isCorrect: true }
        ],
        explanation: 'useState, useEffect, and useContext are all React Hooks. componentDidMount is a class component lifecycle method.'
      },
      {
        id: 'q2',
        question: 'What does JSX stand for?',
        type: 'single' as const,
        options: [
          { id: 'a', text: 'JavaScript XML', isCorrect: true },
          { id: 'b', text: 'Java Syntax Extension', isCorrect: false },
          { id: 'c', text: 'JSON Extension', isCorrect: false },
          { id: 'd', text: 'JavaScript Extension', isCorrect: false }
        ],
        explanation: 'JSX stands for JavaScript XML. It allows you to write HTML-like syntax in your JavaScript code.'
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Learning Components</h1>
        <p className="text-gray-600">Explore these interactive components designed to enhance learning engagement</p>
      </div>

      {/* Flip Cards Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Flip Cards</h2>
        <p className="text-gray-600 mb-6">Interactive cards that reveal information on hover or click</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flipCardData.map((card, index) => (
            <FlipCard
              key={index}
              frontText={card.frontText}
              backText={card.backText}
              triggerMode={card.triggerMode}
              width="w-full"
              height="h-56"
            />
          ))}
        </div>
      </section>

      {/* Accordion Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Accordion</h2>
        <p className="text-gray-600 mb-6">Expandable content sections for organized information</p>
        <InteractiveAccordion 
          items={accordionData}
          allowMultiple={true}
          variant="default"
        />
      </section>

      {/* Slider Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Content Slider</h2>
        <p className="text-gray-600 mb-6">Navigate through content with interactive controls</p>
        <InteractiveSlider
          slides={sliderData}
          autoPlay={false}
          showDots={true}
          showArrows={true}
          slideHeight="h-80"
        />
      </section>

      {/* Tabs Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interactive Tabs</h2>
        <p className="text-gray-600 mb-6">Organize content into accessible tabbed sections</p>
        <InteractiveTabs
          tabs={tabData}
          variant="default"
          orientation="horizontal"
        />
      </section>

      {/* Drag and Drop Assessment */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Drag & Drop Assessment</h2>
        <p className="text-gray-600 mb-6">Interactive sorting exercise to test understanding</p>
        <DragDropAssessment
          title={dragDropData.title}
          instructions={dragDropData.instructions}
          items={dragDropData.items}
          zones={dragDropData.zones}
          onComplete={(score, total) => {
            console.log(`Drag & Drop Score: ${score}/${total}`);
          }}
        />
      </section>

      {/* Multiple Choice Assessment */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Multiple Choice Assessment</h2>
        <p className="text-gray-600 mb-6">Quiz component with instant feedback and explanations</p>
        <MultipleChoiceAssessment
          title={multipleChoiceData.title}
          questions={multipleChoiceData.questions}
          showExplanations={true}
          onComplete={(score, total) => {
            console.log(`Quiz Score: ${score}/${total}`);
          }}
        />
      </section>
    </div>
  );
}