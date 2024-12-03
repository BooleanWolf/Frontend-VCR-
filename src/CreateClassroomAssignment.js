import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CreateClassroomAssignment = () => {
  const { userId, classroomId } = useParams(); // Get userId and classroomId from URL parameters
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const assignmentData = {
      title,
      description,
      deadline,
      author: userId, // Assuming the logged-in user is the author
      classroom: classroomId
    };

    try {
      const response = await fetch(`http://localhost:3000/api/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Redirect to classroom page after assignment creation using navigate
        navigate(`/user/${userId}/classroom/${classroomId}`);
      } else {
        setError(data.message || 'Failed to create assignment.');
      }
    } catch (err) {
      setError('An error occurred while creating the assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3>Create Assignment</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input 
                type="text" 
                className="form-control" 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea 
                className="form-control" 
                id="description" 
                rows="4" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="deadline" className="form-label">Deadline</label>
              <input 
                type="datetime-local" 
                className="form-control" 
                id="deadline" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                required 
              />
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClassroomAssignment;
