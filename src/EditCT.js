import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditCT = () => {
  const { userId, ctId } = useParams(); // Get userId and ctId from the URL
  const navigate = useNavigate(); // For navigation

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the existing CT data when the component is mounted
  useEffect(() => {
    const fetchCT = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/ct/${ctId}`);
        const data = await response.json();

        if (response.ok) {
          setTitle(data.title);
          setDescription(data.description);
          setTime(data.time);
        } else {
          setError(data.message || "Failed to fetch CT.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    };

    fetchCT();
  }, [ctId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const updatedCT = {
      title,
      description,
      time: new Date(time).toISOString(), // Ensure time is in ISO format
      author: userId,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/ct/${ctId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCT),
      });

      if (response.ok) {
        // Redirect to the CT list page after successful update
        navigate(`/user/${userId}/cts`);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update CT.");
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
        <h3>Update CT</h3>
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCT;
