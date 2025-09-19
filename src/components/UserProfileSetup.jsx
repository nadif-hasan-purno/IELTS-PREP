import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserProfileSetup = ({ onComplete }) => {
  const { saveUserProfile } = useLocalStorage();
  const [formData, setFormData] = useState({
    name: '',
    targetBand: '7.0',
    examDate: '',
    studyHoursPerWeek: '10'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const profile = {
      ...formData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    saveUserProfile(profile);
    if (onComplete) {
      onComplete(profile);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Welcome to IELTS Prep Tracker!</h3>
        <p className="mb-6 text-base-content/70">
          Let's set up your profile to personalize your learning experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Your Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Target IELTS Band Score</span>
            </label>
            <select
              name="targetBand"
              value={formData.targetBand}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="5.0">5.0</option>
              <option value="5.5">5.5</option>
              <option value="6.0">6.0</option>
              <option value="6.5">6.5</option>
              <option value="7.0">7.0</option>
              <option value="7.5">7.5</option>
              <option value="8.0">8.0</option>
              <option value="8.5">8.5</option>
              <option value="9.0">9.0</option>
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Target Exam Date (Optional)</span>
            </label>
            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Weekly Study Hours</span>
            </label>
            <select
              name="studyHoursPerWeek"
              value={formData.studyHoursPerWeek}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="5">5 hours</option>
              <option value="10">10 hours</option>
              <option value="15">15 hours</option>
              <option value="20">20 hours</option>
              <option value="25">25+ hours</option>
            </select>
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Start Learning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileSetup;
