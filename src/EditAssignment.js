import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditAssignment = () => {
  const { userId, assignmentId } = useParams(); // Get parameters from route
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch existing assignment details
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/assignments/${assignmentId}`
        );
        const data = await response.json();

        if (response.ok) {
          setFormData({
            title: data.title,
            description: data.description,
            deadline: data.deadline.slice(0, 16), // Format for datetime-local input
          });
        } else {
          setError(data.message || "Failed to fetch assignment.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedAssignment = {
      ...formData,
      author: userId, // Add the author field as per the schema
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/assignments/${assignmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAssignment),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Assignment updated successfully!");
        navigate(`/user/${userId}/assignment`); // Redirect to the assignments page
      } else {
        setError(data.message || "Failed to update assignment.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3>Edit Assignment</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="deadline" className="form-label">
            Deadline
          </label>
          <input
            type="datetime-local"
            id="deadline"
            name="deadline"
            className="form-control"
            value={formData.deadline}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update Assignment
        </button>
      </form>
    </div>
  );
};

export default EditAssignment;
