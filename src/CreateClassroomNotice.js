import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CreateClassroomNotice = () => {
  const { userId, classroomId } = useParams();
  const navigate = useNavigate();
  const [existingNotices, setExistingNotices] = useState([]); // To store existing notices
  const [notices, setNotices] = useState(['']); // New notices to add
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing notices on component mount
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/classroom/${classroomId}`);
        const data = await response.json();

        if (response.ok) {
          setExistingNotices(data.notices || []);
        } else {
          setError(data.message || 'Failed to fetch existing notices.');
        }
      } catch (err) {
        setError('An error occurred while fetching existing notices.');
      }
    };

    fetchNotices();
  }, [classroomId]);

  const handleAddNoticeField = () => {
    setNotices([...notices, '']); // Add a new empty string to the notices array
  };

  const handleRemoveNoticeField = (index) => {
    setNotices(notices.filter((_, i) => i !== index)); // Remove the notice at the specified index
  };

  const handleNoticeChange = (index, value) => {
    const updatedNotices = [...notices];
    updatedNotices[index] = value;
    setNotices(updatedNotices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Combine existing notices with new ones
      const updatedNotices = [...existingNotices, ...notices.filter((notice) => notice.trim() !== '')];

      const response = await fetch(`http://localhost:3000/api/classroom/${classroomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notices: updatedNotices }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Notices added successfully! Redirecting...');
        setNotices(['']); // Reset notices fields
        // Redirect to the classroom page
        setTimeout(() => navigate(`/user/${userId}/classroom/${classroomId}`), 500);
      } else {
        setError(data.message || 'Failed to add notices.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Create Notices for Classroom</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        {notices.map((notice, index) => (
          <div key={index} className="mb-3">
            <label htmlFor={`notice-${index}`} className="form-label">
              Notice {index + 1}
            </label>
            <div className="d-flex gap-2">
              <input
                type="text"
                id={`notice-${index}`}
                className="form-control"
                value={notice}
                onChange={(e) => handleNoticeChange(index, e.target.value)}
                required
              />
              {notices.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveNoticeField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={handleAddNoticeField}
        >
          Add Another Notice
        </button>
        <div>
          <button type="submit" className="btn btn-primary">
            Submit Notices
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassroomNotice;
