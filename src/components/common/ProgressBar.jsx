import React from 'react';

const ProgressBar = ({ 
  current, 
  total, 
  label, 
  showPercentage = true, 
  showNumbers = true,
  size = 'md',
  color = 'primary'
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-6';
      default:
        return 'h-4';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'progress-success';
      case 'warning':
        return 'progress-warning';
      case 'error':
        return 'progress-error';
      case 'info':
        return 'progress-info';
      default:
        return 'progress-primary';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex gap-2 text-sm">
            {showNumbers && (
              <span className="text-base-content/70">
                {current}/{total}
              </span>
            )}
            {showPercentage && (
              <span className="font-medium">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      )}
      
      <progress 
        className={`progress ${getColorClass()} ${getSizeClass()} w-full`}
        value={current} 
        max={total}
      />
      
      {!label && (showNumbers || showPercentage) && (
        <div className="flex justify-between items-center mt-1 text-sm">
          {showNumbers && (
            <span className="text-base-content/70">
              {current}/{total}
            </span>
          )}
          {showPercentage && (
            <span className="font-medium">
              {percentage}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
