import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddAssignment = () => {
  const { id } = useParams(); // Get id from the URL
  const navigate = useNavigate(); // For redirecting after successful submission
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newAssignment = {
      ...formData,
      author: id, // Attach id as author
    };

    try {
      const response = await fetch("http://localhost:3000/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssignment),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Assignment created successfully!");
        navigate(`/user/${id}/assignment`); // Redirect to the assignment list page
      } else {
        setError(data.message || "Failed to create assignment.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Create New Assignment</h3>
      {error && <div className="alert alert-danger">{error}</div>}
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Assignment"}
        </button>
      </form>
    </div>
  );
};

export default AddAssignment;
