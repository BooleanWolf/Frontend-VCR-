import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Lab = () => {
  const { id } = useParams();  // Get id from URL
  const navigate = useNavigate();  // For navigation
  const [labs, setLabs] = useState([]);  // Store lab data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch lab data for the user
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/lab/user/${id}`
        );
        const data = await response.json();

        if (response.ok) {
          setLabs(data);  // Set the fetched lab data
        } else {
          setError(data.message || "Failed to fetch lab data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, [id]);

  // Delete lab by ID
  const handleDelete = async (labId) => {
    const response = await fetch(`http://localhost:3000/api/lab/${labId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove lab from state after successful delete
      setLabs(labs.filter((lab) => lab._id !== labId));
    } else {
      setError("Failed to delete the lab.");
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
          onClick={() => navigate(`/user/${id}/lab`)}
        >
          Add New Lab
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Labs</h3>
        <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/user/${id}`)}  // Navigate to the user's lab page
            >
            Back to User 
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/user/${id}/lab`)}
        >
          Add New Lab
        </button>
      </div>

      {labs.length > 0 ? (
        <div className="row">
          {labs.map((lab) => (
            <div className="col-md-4 mb-4" key={lab._id}>
              <LabCard lab={lab} id={id} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div>No labs found.</div>
      )}
    </div>
  );
};

const LabCard = ({ lab, id, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{lab.title}</h5>
        <p className="card-text">{lab.description}</p>
        <p>
          <strong>Lab Time:</strong>{" "}
          {new Date(lab.time).toLocaleString()}
        </p>
        <p>
          <strong>Report Time:</strong>{" "}
          {new Date(lab.reportTime).toLocaleString()}
        </p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/user/${id}/lab/${lab._id}`)}
          >
            Edit Lab
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(lab._id)}
          >
            Delete Lab
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lab;
