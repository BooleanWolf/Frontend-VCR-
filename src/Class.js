import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Class = () => {
  const { id } = useParams();  // Get id from URL (user ID)
  const navigate = useNavigate();  // For navigation
  const [classes, setClasses] = useState([]);  // Store class data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch class data for the user
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        console.log(id); 
        const response = await fetch(
          `http://localhost:3000/api/class/user/${id}`
        );
        const data = await response.json();

        if (response.ok) {
          setClasses(data);  // Set the fetched class data
        } else {
          setError(data.error || "Failed to fetch class data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [id]);

  // Delete class by ID
  const handleDelete = async (classId) => {
    const response = await fetch(`http://localhost:3000/api/class/${classId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove class from state after successful delete
      setClasses(classes.filter((classItem) => classItem._id !== classId));
    } else {
      setError("Failed to delete the class.");
    }
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
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/user/${id}/add-class`)}
        >
          Add New Class
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Classes</h3>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/user/${id}`)}  // Navigate to the user's page
        >
          Back to User
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/user/${id}/add-class`)}
        >
          Add New Class
        </button>
      </div>

      {classes.length > 0 ? (
        <div className="row">
          {classes.map((classItem) => (
            <div className="col-md-4 mb-4" key={classItem._id}>
              <ClassCard classItem={classItem} id={id} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div>No classes found.</div>
      )}
    </div>
  );
};

const ClassCard = ({ classItem, id, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{classItem.title}</h5>
        <p className="card-text">{classItem.description}</p>
        <p>
          <strong>Class Time:</strong> {new Date(classItem.time).toLocaleString()}
        </p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/user/${id}/class/${classItem._id}`)}
          >
            Edit Class
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(classItem._id)}
          >
            Delete Class
          </button>
        </div>
      </div>
    </div>
  );
};

export default Class;
