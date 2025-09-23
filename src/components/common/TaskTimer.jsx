import React from 'react';
import { useDispatch } from 'react-redux';
import { useTimer } from '../../hooks/useTimer';
import { startTaskSession, completeTaskSession } from '../../utils/tasksSlice';

const TaskTimer = ({ task, onTaskUpdate }) => {
  const dispatch = useDispatch();
  const {
    time,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    formatTime
  } = useTimer(task.status);

  const handleStart = async () => {
    start();
    try {
      await dispatch(startTaskSession({ 
        taskId: task.id, 
        module: task.module 
      })).unwrap();
    } catch (error) {
      console.error('Failed to start task session:', error);
    }
  };

  const handlePause = () => {
    pause();
  };

  const handleResume = () => {
    resume();
  };

  const handleComplete = async () => {
    const session = stop();
    try {
      await dispatch(completeTaskSession({ 
        taskId: task.id, 
        duration: session.duration 
      })).unwrap();
      reset();
    } catch (error) {
      console.error('Failed to complete task session:', error);
    }
  };

  const handleReset = () => {
    reset();
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-warning';
      default:
        return 'text-base-content';
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'completed':
        return <div className="badge badge-success">Completed</div>;
      case 'in-progress':
        return <div className="badge badge-warning">In Progress</div>;
      default:
        return <div className="badge badge-ghost">Not Started</div>;
    }
  };

  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`card-title ${getStatusColor()}`}>{task.title}</h3>
            <p className="text-sm text-base-content/70">{task.description}</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-4">
          <div className="text-4xl font-mono font-bold text-primary mb-2">
            {formatTime()}
          </div>
          {task.totalTime > 0 && (
            <div className="text-sm text-base-content/70">
              Total time: {formatTotalTime(task.totalTime)}
            </div>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex gap-2 justify-center mb-4">
          {!isActive && !isPaused && task.status !== 'completed' && (
            <button onClick={handleStart} className="btn btn-primary">
              Start Studying
            </button>
          )}
          
          {isActive && !isPaused && (
            <>
              <button onClick={handlePause} className="btn btn-warning">
                Pause
              </button>
              <button onClick={handleComplete} className="btn btn-success">
                Complete
              </button>
            </>
          )}
          
          {isPaused && (
            <>
              <button onClick={handleResume} className="btn btn-primary">
                Resume
              </button>
              <button onClick={handleComplete} className="btn btn-success">
                Complete
              </button>
            </>
          )}

          {(isActive || isPaused || time > 0) && (
            <button onClick={handleReset} className="btn btn-ghost btn-sm">
              Reset
            </button>
          )}
        </div>

        {/* Task Details */}
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-sm font-medium">
            View Details & Resources
          </div>
          <div className="collapse-content">
            {task.subtopics && task.subtopics.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Topics to cover:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {task.subtopics.map((subtopic, index) => (
                    <li key={index} className="text-sm">{subtopic}</li>
                  ))}
                </ul>
              </div>
            )}

            {task.resources && task.resources.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Resources:</h4>
                <div className="space-y-2">
                  {task.resources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`badge badge-outline badge-sm`}>
                        {resource.type}
                      </div>
                      <span className="text-sm">{resource.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task.estimatedTime && (
              <div className="mt-4 text-sm text-base-content/70">
                Estimated time: {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
              </div>
            )}
          </div>
        </div>

        {/* Study Sessions */}
        {task.sessions && task.sessions.length > 0 && (
          <div className="mt-4">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium">
                Study Sessions ({task.sessions.length})
              </div>
              <div className="collapse-content">
                <div className="space-y-2">
                  {task.sessions.map((session, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>Session {index + 1}</span>
                      <span>{formatTotalTime(session.duration)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTimer;
