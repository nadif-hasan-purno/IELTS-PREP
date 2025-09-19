# IELTS Preparation Tracker

A frontend-only web application for tracking IELTS exam preparation progress with structured syllabi, time tracking, and progress monitoring.

## Features

- 📚 **Structured Syllabus**: Pre-defined learning paths for all four IELTS modules (Listening, Reading, Writing, Speaking)
- ⏱️ **Time Tracking**: Built-in timer to track study sessions for each task
- 📊 **Progress Visualization**: Visual progress bars and statistics for each module
- 💾 **Local Storage**: All data is stored locally in your browser (no backend required)
- 🎨 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🌙 **Dark/Light Theme**: Toggle between light and dark themes

## Modules Included

### Listening Module
- Understanding different accents
- Note-taking strategies  
- Multiple choice questions
- Form completion
- Map and diagram labeling

### Reading Module
- Skimming and scanning techniques
- Academic vocabulary building
- True/False/Not Given questions
- Matching headings
- Summary completion

### Writing Module
- Task 1 - Data description
- Task 2 - Essay structure
- Grammar for writing
- Vocabulary enhancement
- Time management and planning

### Speaking Module
- Part 1 - Introduction and interview
- Part 2 - Long turn
- Part 3 - Discussion
- Pronunciation and fluency
- Advanced vocabulary and expressions

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ielts-prep-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5174`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Dashboard**: View overall progress and module statistics
2. **Module Pages**: Click on any module card to view its specific tasks
3. **Task Timer**: Use the start/pause/complete buttons to track your study sessions
4. **Progress Tracking**: Your progress is automatically saved to localStorage

## Data Storage

All your progress data is stored locally in your browser's localStorage. This means:
- Your data persists between browser sessions
- No data is sent to any server
- You can clear your browser data to start fresh

## Technology Stack

- **Framework**: React with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + DaisyUI
- **Icons**: Built-in emoji support
- **Storage**: Browser localStorage

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── TaskTimer.jsx
│   │   └── ProgressBar.jsx
│   ├── Dashboard.jsx    # Main dashboard
│   ├── ModuleView.jsx   # Module-specific view
│   ├── NavBar.jsx       # Navigation
│   └── Footer.jsx       # Footer
├── data/
│   └── syllabusData.js  # IELTS syllabus structure
├── hooks/
│   ├── useLocalStorage.js # Local storage utilities
│   └── useTimer.js      # Timer functionality
├── utils/
│   ├── appStore.js      # Redux store configuration
│   ├── tasksSlice.js    # Tasks state management
│   └── userSlice.js     # User state management
└── pages/
    └── (routing handled by React Router)
```

## Contributing

This is a frontend-only application designed for personal use. Feel free to extend it with additional features:

- Export/import progress data
- Add more IELTS practice materials
- Implement study reminders
- Add more detailed statistics

## License

This project is open source and available under the MIT License.
