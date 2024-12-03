import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const Classroom = () => {
  const { userId, classroomId } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Default filter for all content types
  const [isCreator, setIsCreator] = useState(false); 

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/classroom/${classroomId}`);
        const data = await response.json();

        if (response.ok) {
          setClassroom(data);
          if(userId === data.creator._id) {
            setIsCreator(true);
          }
        } else {
          setError('Failed to fetch classroom data.');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [classroomId]);

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const { title, students, assignments, cts, labs, classes, notices, code, creator } = classroom;

  // Filter the content based on the selected type
  const getFilteredContent = () => {
    const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A');
  
    const mapContentWithTypeAndDate = (contentArray, type, dateKey) =>
      contentArray.map((item) => ({
        ...item,
        type,
        date: formatDate(item[dateKey]),
      }));
  
    switch (filter) {
      case 'assignments':
        return mapContentWithTypeAndDate(assignments, 'Assignment', 'deadline');
      case 'cts':
        return mapContentWithTypeAndDate(cts, 'CT', 'time');
      case 'labs':
        return mapContentWithTypeAndDate(labs, 'Lab', 'time');
      case 'classes':
        return mapContentWithTypeAndDate(classes, 'Class', 'time');
      case 'notices':
        return notices.map((notice) => ({
          title: notice,
          type: 'Notice',
          date: formatDate(notice.createdAt),
        }));
      case 'all':
        return [
          ...mapContentWithTypeAndDate(assignments, 'Assignment', 'deadline'),
          ...mapContentWithTypeAndDate(cts, 'CT', 'time'),
          ...mapContentWithTypeAndDate(labs, 'Lab', 'time'),
          ...mapContentWithTypeAndDate(classes, 'Class', 'time'),
          ...notices.map((notice) => ({
            title: notice,
            type: 'Notice',
            date: formatDate(notice.createdAt),
          })),
        ];
      default:
        return [];
    }
  };
  
  
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3>{title}</h3>
                <div className="classroom-code">
                  <strong>Class Code:</strong> {code}
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* Filter Buttons */}
              <div className="d-flex gap-2 mb-4">
                <button className="btn btn-secondary" onClick={() => handleFilterChange('all')}>All</button>
                <button className="btn btn-secondary" onClick={() => handleFilterChange('assignments')}>Assignments</button>
                <button className="btn btn-secondary" onClick={() => handleFilterChange('cts')}>CTs</button>
                <button className="btn btn-secondary" onClick={() => handleFilterChange('labs')}>Labs</button>
                <button className="btn btn-secondary" onClick={() => handleFilterChange('classes')}>Classes</button>
                <button className="btn btn-secondary" onClick={() => handleFilterChange('notices')}>Notices</button>
              </div>

              {/* Content Creation Buttons for Creator */}
              {isCreator && (
                <div className="mb-4">
                  <Link to={`/user/${userId}/classroom/${classroom._id}/create-assignment`}>
                    <button className="btn btn-success me-2">Create Assignment</button>
                  </Link> 

                  <Link to={`/user/${userId}/classroom/${classroom._id}/create-lab`}>
                    <button className="btn btn-success me-2">Create Lab</button>
                  </Link> 

                  {/* <Link to={`/user/${userId}/classroom/${classroom._id}/create-class`}>
                    <button className="btn btn-success me-2">Create Class</button>
                  </Link>  */}

                  <Link to={`/user/${userId}/classroom/${classroom._id}/create-ct`}>
                    <button className="btn btn-success me-2">Create CT</button>
                  </Link> 

                  <Link to={`/user/${userId}/classroom/${classroom._id}/create-notice`}>
                    <button className="btn btn-success me-2">Create Notice</button>
                  </Link> 
                </div>
              )}

              {/* Filtered Content */}
              <div>
                {getFilteredContent().length > 0 ? (
                  <ul className="list-group">
                    {getFilteredContent().map((item, index) => (
                      <li key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Type:</strong> {filter === 'all' ? item.type || 'Unknown' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                            <br />
                            <strong>Title:</strong> {item.title || 'Untitled'}
                          </div>
                          <div>
                            <strong>Date:</strong> {item.date}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No content available.</p>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar (Joined Students) */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5>Joined Students</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              {students.length > 0 ? (
                <div>
                  <ul className="list-group">
                    {students.map((student) => (
                      <li key={student._id} className="list-group-item">
                        {student.name} {/* Assuming student has a 'name' property */}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <strong>Total Students: </strong>{students.length}
                  </div>
                </div>
              ) : (
                <p>No students joined yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
