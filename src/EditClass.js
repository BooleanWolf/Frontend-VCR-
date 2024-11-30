import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditClass = () => {
  const { userId, classId } = useParams(); // Get userId and classId from URL
  const navigate = useNavigate(); // For navigation

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the class data to pre-fill the form
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/class/${classId}`);
        const data = await response.json();

        if (response.ok) {
          setFormData({
            title: data.title,
            description: data.description || "",
            time: new Date(data.time).toISOString().slice(0, 16), // Format the time to match datetime-local input format
          });
        } else {
          setError(data.message || "Failed to fetch class data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit the form to update the class
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:3000/api/class/${classId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          author: userId, // Assuming the class is being updated by the user
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/user/${userId}/class`); // Redirect to the class list after successful update
      } else {
        setError(data.message || "Failed to update the class.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="container mt-5">
      <h3>Edit Class</h3>
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
          {loading ? "Updating..." : "Update Class"}
        </button>
      </form>

      <div className="mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/user/${userId}/class`)}
        >
          Back to Classes
        </button>
      </div>
    </div>
  );
};

export default EditClass;
