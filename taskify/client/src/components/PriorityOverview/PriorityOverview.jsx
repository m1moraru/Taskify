import React from 'react';
import './PriorityOverview.css';

const PriorityOverview = ({ tasks }) => {
  const countTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  return (
    <div className="priority-overview">
      <div className="priority-item total-tasks">
        <div className="vertical-line purple"></div>
        <div className="priority-info">
          <p>Total Tasks:</p>
          <h2>{tasks.length}</h2>
        </div>
      </div>
      <div className="priority-item in-progress">
        <div className="vertical-line teal"></div>
        <div className="priority-info">
          <p>In Progress:</p>
          <h2>{countTasksByStatus('In_Progress')}</h2>
        </div>
      </div>
      <div className="priority-item open-tasks">
        <div className="vertical-line orange"></div>
        <div className="priority-info">
          <p>Open:</p>
          <h2>{countTasksByStatus('To-Do')}</h2>
        </div>
      </div>
      <div className="priority-item completed">
        <div className="vertical-line green"></div>
        <div className="priority-info">
          <p>Completed:</p>
          <h2>{countTasksByStatus('Completed')}</h2>
        </div>
      </div>
    </div>
  );
};

export default PriorityOverview;

