import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Assignments = () => {
  const { id } = useParams(); // User ID from route
  const navigate = useNavigate(); // For navigation
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch assignments data for the user
    const fetchAssignments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/assignments/user/${id}`
        );
        const data = await response.json();

        if (response.ok) {
          setAssignments(data);
        } else {
          setError(data.message || "Failed to fetch assignments.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [id]);

  const handleDelete = async (assignmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/assignments/${assignmentId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          // Remove the deleted assignment from the list
          setAssignments((prevAssignments) =>
            prevAssignments.filter((assignment) => assignment._id !== assignmentId)
          );
        } else {
          alert("Failed to delete assignment.");
        }
      } catch (err) {
        alert("Something went wrong. Please try again.");
      }
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
        <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/user/${id}/add-assignment`)}
          >
            Add New Assignment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/user/${id}`)} // Navigate back to the user page
        >
          Back
        </button>
        <h3>Assignments</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/user/${id}/add-assignment`)}
        >
          Add New Assignment
        </button>
      </div>

      {assignments.length > 0 ? (
        <div className="row">
          {assignments.map((assignment) => (
            <div className="col-md-4 mb-4" key={assignment._id}>
              <AssignmentCard
                assignment={assignment}
                id={id}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/user/${id}/add-assignment`)}
          >
            Add New Assignment
          </button>
          <p>No assignments found.</p>
        </div>
      )}
    </div>
  );
};

const AssignmentCard = ({ assignment, id, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{assignment.title}</h5>
        <p className="card-text">{assignment.description}</p>
        <p>
          <strong>Deadline:</strong>{" "}
          {new Date(assignment.deadline).toLocaleDateString()}
        </p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/user/${id}/assignment/${assignment._id}`)}
          >
            Edit Assignment
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(assignment._id)}
          >
            Delete Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
