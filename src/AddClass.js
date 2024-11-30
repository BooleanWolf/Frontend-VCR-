import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddClass = () => {
  const { id } = useParams();  // Get user ID from the URL
  const navigate = useNavigate();  // For navigation

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit the form to create a new class
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          author: id,  // Set the user ID as the author
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/user/${id}/class`);  // Redirect to the class page after successful class creation
      } else {
        setError(data.message || "Failed to add the class.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Add New Class</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Class Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Class Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="time" className="form-label">
            Class Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Class"}
        </button>
      </form>

      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate(`/user/${id}/class`)}>
          Back to Classes
        </button>
      </div>
    </div>
  );
};

export default AddClass;
