import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddLab = () => {
  const { userId } = useParams();  // Get userId from URL
  const navigate = useNavigate();  // For navigation

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    reportTime: "",
    author: userId,  // Set author as the userId from URL
  });

  const [error, setError] = useState("");  // To store error messages
  const [loading, setLoading] = useState(false);  // To handle loading state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/lab/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate back to the lab list page
        navigate(`/user/${userId}/labs`);
      } else {
        setError(data.message || "Failed to create the lab.");
      }
    } catch (err) {
      setError("An error occurred while creating the lab.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Create a New Lab</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Lab Title
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
            Lab Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="time" className="form-label">
            Lab Time
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

        <div className="mb-3">
          <label htmlFor="reportTime" className="form-label">
            Report Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="reportTime"
            name="reportTime"
            value={formData.reportTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/user/${userId}/labs`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Lab"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLab;
