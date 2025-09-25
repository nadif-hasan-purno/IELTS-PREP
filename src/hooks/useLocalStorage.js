import { useDispatch } from 'react-redux';
import { setTasks } from '../utils/tasksSlice';
import { getAllTasks } from '../data/syllabusData';

export const useLocalStorage = () => {
  const dispatch = useDispatch();

  // Initialize tasks from localStorage or create default structure
  const initializeTasks = () => {
    const savedTasks = localStorage.getItem('ieltsTasks');
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        dispatch(setTasks(parsedTasks));
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
        createDefaultTasks();
      }
    } else {
      createDefaultTasks();
    }
  };

  // Create default task structure from syllabus data
  const createDefaultTasks = () => {
    const allTasks = getAllTasks();
    const defaultTasks = allTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      module: task.id.split('-')[0], // Extract module from id
      status: 'not-started', // 'not-started', 'in-progress', 'completed'
      totalTime: 0, // Total time spent in seconds
      sessions: [], // Array of study sessions
      completedAt: null,
      startedAt: null,
      estimatedTime: task.estimatedTime,
      subtopics: task.subtopics,
      resources: task.resources
    }));
    
    dispatch(setTasks(defaultTasks));
    localStorage.setItem('ieltsTasks', JSON.stringify(defaultTasks));
  };

  // Save tasks to localStorage
  const saveTasks = (tasks) => {
    if (tasks) {
      localStorage.setItem('ieltsTasks', JSON.stringify(tasks));
    }
  };

  // Save user profile
  const saveUserProfile = (profile) => {
    localStorage.setItem('ieltsUserProfile', JSON.stringify(profile));
  };

  // Get user profile
  const getUserProfile = () => {
    const savedProfile = localStorage.getItem('ieltsUserProfile');
    if (savedProfile && savedProfile !== 'undefined') {
      try {
        return JSON.parse(savedProfile);
      } catch (error) {
        console.error('Error parsing user profile:', error);
        return null;
      }
    }
    return null;
  };

  // Save theme preference
  const saveTheme = (theme) => {
    localStorage.setItem('ieltsTheme', theme);
  };

  // Get theme preference
  const getTheme = () => {
    return localStorage.getItem('ieltsTheme') || 'light';
  };

  return {
    initializeTasks,
    saveTasks,
    saveUserProfile,
    getUserProfile,
    saveTheme,
    getTheme
  };
};
