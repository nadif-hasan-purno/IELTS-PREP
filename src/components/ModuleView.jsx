import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TaskTimer from './common/TaskTimer';
import ProgressBar from './common/ProgressBar';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ModuleView = () => {
  const { id } = useParams();
  const tasks = useSelector((store) => store.tasks);
  const { initializeTasks, saveTasks } = useLocalStorage();

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      initializeTasks();
    }
  }, [tasks, initializeTasks]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks, saveTasks]);

  const moduleTasks = tasks ? tasks.filter((task) => task.module.toLowerCase() === id.toLowerCase()) : [];

  const getModuleProgress = () => {
    if (moduleTasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = moduleTasks.filter((task) => task.status === 'completed').length;
    return {
      completed,
      total: moduleTasks.length,
      percentage: Math.round((completed / moduleTasks.length) * 100)
    };
  };

  const getTotalStudyTime = () => {
    return moduleTasks.reduce((total, task) => total + (task.totalTime || 0), 0);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleTaskUpdate = () => {
    // This will trigger a re-render and save to localStorage
    // The useEffect above will handle saving to localStorage
  };

  const progress = getModuleProgress();
  const totalTime = getTotalStudyTime();

  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Module Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {id.charAt(0).toUpperCase() + id.slice(1)} Module
        </h1>
        
        {/* Module Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Progress</div>
            <div className="stat-value text-primary">{progress.percentage}%</div>
            <div className="stat-desc">{progress.completed} of {progress.total} tasks completed</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Study Time</div>
            <div className="stat-value text-secondary">{formatTime(totalTime)}</div>
            <div className="stat-desc">Total time invested</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Tasks</div>
            <div className="stat-value">{moduleTasks.length}</div>
            <div className="stat-desc">Total learning tasks</div>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          current={progress.completed}
          total={progress.total}
          label={`${id.charAt(0).toUpperCase() + id.slice(1)} Module Progress`}
          size="lg"
          color="primary"
        />
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {moduleTasks.map((task) => (
          <TaskTimer
            key={task.id}
            task={task}
            onTaskUpdate={handleTaskUpdate}
          />
        ))}
      </div>

      {/* Module Summary */}
      {moduleTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
          <p className="text-base-content/70">
            Tasks for this module will appear here once they are loaded.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModuleView;
