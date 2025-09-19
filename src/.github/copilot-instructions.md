# Frontend-Only IELTS Prep Tracker - Copilot Instructions

## Project Overview

Build a frontend-only IELTS preparation application that provides structured syllabi for all four modules (Listening, Reading, Writing, Speaking) with progress tracking and time monitoring features.

## Technical Stack

- **Framework**: React with Vite
- **State Management**: React Context API + useReducer
- **Storage**: Browser localStorage for data persistence
- **Styling**: Tailwind CSS + DaisyUI with custom themes
- **Icons**: Lucide React or similar icon library
- **Charts**: Recharts or similar for progress visualization

## Project Structure

```
/src
├── components/
│   ├── auth/           # Login/Register components
│   ├── dashboard/      # Main dashboard with progress overview
│   ├── modules/        # Module-specific components
│   │   ├── Listening/
│   │   ├── Reading/
│   │   ├── Writing/
│   │   └── Speaking/
│   ├── common/         # Reusable UI components
│   │   ├── TaskTimer.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── SyllabusItem.jsx
│   │   └── TimeTracker.jsx
│   └── layout/         # Layout components
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       └── Layout.jsx
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   ├── TaskContext.jsx
│   └── ThemeContext.jsx
├── data/               # Static data
│   └── syllabusData.js # Pre-defined IELTS syllabus
├── hooks/              # Custom hooks
│   ├── useLocalStorage.js
│   └── useTimer.js
├── utils/              # Utility functions
│   ├── storage.js
│   └── timeCalculations.js
└── pages/              # Main pages
    ├── Dashboard.jsx
    ├── ModulePage.jsx
    └── AuthPage.jsx
```

## Core Features Implementation

### 1. Syllabus Data Structure

```javascript
// data/syllabusData.js
export const syllabusData = {
  listening: [
    {
      id: 'listening-1',
      title: 'Understanding different accents',
      description: 'Practice with British, American, and Australian accents',
      subtopics: [
        'British English pronunciation',
        'American English variations',
        'Australian slang and pronunciation'
      ],
      estimatedTime: 120, // in minutes
      resources: [
        { type: 'video', url: '#', title: 'Accent Comparison Video' },
        { type: 'article', url: '#', title: 'Understanding Accents Guide' }
      ]
    },
    // More listening tasks...
  ],
  reading: [...],
  writing: [...],
  speaking: [...]
};
```

### 2. Task State Management

```javascript
// contexts/TaskContext.jsx
import React, { createContext, useContext, useReducer } from "react";

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case "START_TASK":
      return {
        ...state,
        [action.payload.taskId]: {
          status: "in-progress",
          startTime: new Date().toISOString(),
          sessions: [...(state[action.payload.taskId]?.sessions || [])],
        },
      };
    case "COMPLETE_TASK":
      return {
        ...state,
        [action.payload.taskId]: {
          status: "completed",
          endTime: new Date().toISOString(),
          totalDuration: calculateTotalDuration(state[action.payload.taskId]),
          sessions: [
            ...(state[action.payload.taskId]?.sessions || []),
            {
              start: state[action.payload.taskId].startTime,
              end: new Date().toISOString(),
              duration: calculateSessionDuration(
                state[action.payload.taskId].startTime
              ),
            },
          ],
        },
      };
    case "PAUSE_TASK":
      return {
        ...state,
        [action.payload.taskId]: {
          ...state[action.payload.taskId],
          status: "paused",
          sessions: [
            ...state[action.payload.taskId].sessions,
            {
              start: state[action.payload.taskId].startTime,
              end: new Date().toISOString(),
              duration: calculateSessionDuration(
                state[action.payload.taskId].startTime
              ),
            },
          ],
        },
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, {});

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
```

### 3. Timer Component

```jsx
// components/common/TaskTimer.jsx
import React, { useState, useEffect } from "react";
import { useTasks } from "../../contexts/TaskContext";

const TaskTimer = ({ taskId }) => {
  const { tasks, dispatch } = useTasks();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && elapsedTime !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, elapsedTime]);

  const startTimer = () => {
    setIsActive(true);
    dispatch({ type: "START_TASK", payload: { taskId } });
  };

  const pauseTimer = () => {
    setIsActive(false);
    dispatch({ type: "PAUSE_TASK", payload: { taskId } });
  };

  const completeTask = () => {
    setIsActive(false);
    dispatch({ type: "COMPLETE_TASK", payload: { taskId } });
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="task-timer">
      <div className="timer-display">{formatTime(elapsedTime)}</div>
      <div className="timer-controls">
        {!isActive ? (
          <button onClick={startTimer} className="btn btn-primary">
            Start Studying
          </button>
        ) : (
          <>
            <button onClick={pauseTimer} className="btn btn-secondary">
              Pause
            </button>
            <button onClick={completeTask} className="btn btn-success">
              Mark Complete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskTimer;
```

### 4. Progress Tracking

```javascript
// hooks/useProgress.js
import { useTasks } from "../contexts/TaskContext";
import { syllabusData } from "../data/syllabusData";

export const useProgress = () => {
  const { tasks } = useTasks();

  const calculateModuleProgress = (module) => {
    const moduleTasks = syllabusData[module];
    const completedTasks = moduleTasks.filter(
      (task) => tasks[task.id]?.status === "completed"
    ).length;

    return {
      completed: completedTasks,
      total: moduleTasks.length,
      percentage: Math.round((completedTasks / moduleTasks.length) * 100),
    };
  };

  const calculateTotalStudyTime = () => {
    return Object.values(tasks).reduce((total, task) => {
      return total + (task.totalDuration || 0);
    }, 0);
  };

  const getRecentSessions = (limit = 5) => {
    const allSessions = Object.entries(tasks)
      .filter(([_, task]) => task.sessions)
      .flatMap(([taskId, task]) =>
        task.sessions.map((session) => ({
          taskId,
          ...session,
        }))
      )
      .sort((a, b) => new Date(b.end) - new Date(a.end))
      .slice(0, limit);

    return allSessions;
  };

  return {
    calculateModuleProgress,
    calculateTotalStudyTime,
    getRecentSessions,
  };
};
```

### 5. Local Storage Integration

```javascript
// hooks/useLocalStorage.js
import { useEffect } from "react";
import { useTasks } from "../contexts/TaskContext";

export const useLocalStorage = () => {
  const { tasks } = useTasks();

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("ieltsTasks");
    if (savedTasks) {
      // You would dispatch an action to load tasks here
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ieltsTasks", JSON.stringify(tasks));
  }, [tasks]);
};
```

## Implementation Guidelines

1. **Start with the data structure**: Define the complete syllabus for all modules
2. **Build the context providers**: Set up TaskContext and AuthContext
3. **Create reusable components**: Timer, ProgressBar, SyllabusItem
4. **Implement module pages**: Create dedicated pages for each IELTS module
5. **Add dashboard**: Build a comprehensive dashboard with progress overview
6. **Style with Tailwind**: Use DaisyUI components for consistent styling
7. **Test thoroughly**: Ensure all functionality works without a backend

## Styling Approach

- Use DaisyUI's theme system for light/dark mode
- Create a cohesive color scheme that works for educational content
- Ensure mobile responsiveness for studying on various devices
- Use clear visual indicators for task status (not started, in progress, completed)

This frontend-only approach will allow users to track their IELTS preparation progress with all data stored locally in their browser. Later, this can be extended to a full-stack application with user accounts and cloud storage.
