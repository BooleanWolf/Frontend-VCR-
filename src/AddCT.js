import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddCT = () => {
  const { userId } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate(); // For navigation

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newCT = {
      title,
      description,
      time: new Date(time).toISOString(), // Ensure the time is in ISO format
      author: userId,
    };

    try {
      const response = await fetch("http://localhost:3000/api/ct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCT),
      });

      if (response.ok) {
        // Redirect to the CT list page after successful addition
        navigate(`/user/${userId}/cts`);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create CT.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/user/${userId}/cts`)} // Navigate back to the CT list page
        >
          Back
        </button>
        <h3>Add New CT</h3>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">CT Title</label>
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
          <label htmlFor="description" className="form-label">CT Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="time" className="form-label">Date and Time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save CT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCT;
