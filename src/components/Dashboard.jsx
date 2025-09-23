import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from './common/ProgressBar';
import { fetchTasks } from '../utils/tasksSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector((store) => store.tasks);
  const tasks = useMemo(() => tasksState.tasks || [], [tasksState.tasks]);

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks.length]);

  const modules = [
    { name: 'Listening', id: 'listening' },
    { name: 'Reading', id: 'reading' },
    { name: 'Writing', id: 'writing' },
    { name: 'Speaking', id: 'speaking' },
  ];

  const getModuleProgress = (moduleId) => {
    if (!tasks || tasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const moduleTasks = tasks.filter((task) => task.module === moduleId);
    if (moduleTasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = moduleTasks.filter((task) => task.status === 'completed').length;
    return {
      completed,
      total: moduleTasks.length,
      percentage: Math.round((completed / moduleTasks.length) * 100)
    };
  };

  const getTotalStudyTime = () => {
    if (!tasks || tasks.length === 0) return 0;
    return tasks.reduce((total, task) => total + (task.totalTime || 0), 0);
  };

  const getTotalProgress = () => {
    if (!tasks || tasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return {
      completed,
      total: tasks.length,
      percentage: Math.round((completed / tasks.length) * 100)
    };
  };

  const getRecentCompletedTasks = (limit = 5) => {
    if (!tasks || tasks.length === 0) return [];
    return tasks
      .filter((task) => task.status === 'completed' && task.completedAt)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalProgress = getTotalProgress();
  const totalTime = getTotalStudyTime();
  const recentTasks = getRecentCompletedTasks();

  if (tasksState.loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">IELTS Preparation Dashboard</h1>
        <div className="text-center py-16 text-base-content/70">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to your IELTS Prep Dashboard!</h2>
          <p className="mb-6">Loading your study plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">IELTS Preparation Dashboard</h1>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Overall Progress</div>
          <div className="stat-value text-primary">{totalProgress.percentage}%</div>
          <div className="stat-desc">{totalProgress.completed} of {totalProgress.total} tasks completed</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Study Time</div>
          <div className="stat-value text-secondary">{formatTime(totalTime)}</div>
          <div className="stat-desc">Time invested in preparation</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Modules</div>
          <div className="stat-value">{modules.length}</div>
          <div className="stat-desc">IELTS modules to master</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <ProgressBar
          current={totalProgress.completed}
          total={totalProgress.total}
          label="Overall IELTS Preparation Progress"
          size="lg"
          color="primary"
        />
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {modules.map((module) => {
          const progress = getModuleProgress(module.id);
          return (
            <div key={module.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h2 className="card-title">{module.name}</h2>
                
                <ProgressBar
                  current={progress.completed}
                  total={progress.total}
                  showPercentage={false}
                  showNumbers={true}
                  size="sm"
                  color="primary"
                />
                
                <div className="text-sm text-base-content/70">
                  {progress.completed} of {progress.total} tasks completed
                </div>
                
                <div className="card-actions justify-end mt-4">
                  <Link 
                    to={`/module/${module.id}`} 
                    className="btn btn-primary btn-sm"
                  >
                    View Module
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Activity</h2>
          
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="badge badge-success">Completed</div>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-base-content/70">
                        {task.module.charAt(0).toUpperCase() + task.module.slice(1)} Module
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-base-content/70">
                    {task.completedAt && new Date(task.completedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-base-content/70">
              <div className="text-4xl mb-4">📝</div>
              <p>No recent activity yet. Start studying to see your progress here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
