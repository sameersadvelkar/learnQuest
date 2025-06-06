# LearnQuest - Educational Learning Management System of Coursewind

A modern, gamified educational LMS (Learning Management System) built with React and Express, featuring sequential module progression, interactive content, and comprehensive progress tracking.

## Features

- **Sequential Learning**: Students must complete Module 1 before accessing subsequent modules
- **Interactive Content**: Support for videos, readings, quizzes, and assignments
- **Progress Tracking**: Real-time progress monitoring with visual indicators
- **Gamification**: Achievement system with badges and streak tracking
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Module-based Architecture**: Organized course content with clear progression paths
- **Visual Feedback**: Clean UI with progress bars and status indicators

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for development and building
- Wouter for routing
- TanStack Query for state management
- Radix UI components

**Backend:**
- Express.js with TypeScript
- In-memory storage (easily replaceable with database)
- Session management
- RESTful API design

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/LearnQuest.git
cd LearnQuest
```
2. Install dependencies:

  ```- npm install```
  
3. Start the development servers:

Option 1: Using separate terminals

# Terminal 1 - Backend
```npm run dev```
# Terminal 2 - Frontend
```npx vite --port 5173```

Option 2: Using concurrently (recommended)

```npm install --save-dev concurrently```
  ``` npm run dev:full```


Open your browser to http://localhost:5173
Development Scripts

```npm run dev - Start backend server```

```npm run build - Build for production```

```npm run start - Run production server```

```npm run check - TypeScript type checking```

```Project Structure
LearnQuest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   └── pages/          # Page components
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage layer
├── shared/                 # Shared types and schemas
└── attached_assets/        # Static assets
```

Key Features
Sequential Module Progression
Students must complete all activities in Module 1 before accessing Module 2
Visual indicators show locked/available/completed module states
Progress is tracked and persisted locally
Content Management
JSON-based content structure for easy updates
Support for multiple content types (video, text, quizzes)
Modular architecture for scalable content organization
Progress Tracking
Real-time progress calculation
Achievement system with unlockable badges
Streak tracking for consistent learning
Contributing
Fork the repository
```
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
```
License
This project is licensed under the MIT License - see the LICENSE file for details.

Support
If you encounter any issues or have questions, please open an issue on GitHub.
