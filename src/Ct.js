import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Ct = () => {
  const { id } = useParams(); // User ID from route
  const navigate = useNavigate(); // For navigation
  const [ctData, setCtData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch Ct data for the user
    const fetchCtData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/ct/user/${id}`
        );
        const data = await response.json();

        if (response.ok) {
          setCtData(data);
        } else {
          setError(data.error || "Failed to fetch Ct data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCtData();
  }, [id]);

  const handleDelete = async (ctId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Ct?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/ct/${ctId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          // Remove the deleted Ct from the list
          setCtData((prevCtData) =>
            prevCtData.filter((ct) => ct._id !== ctId)
          );
        } else {
          alert("Failed to delete Ct.");
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
            onClick={() => navigate(`/user/${id}/add-ct`)}
          >
            Add New Ct
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
          Back to User
        </button>
        <h3>Ct Data</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/user/${id}/add-ct`)}
        >
          Add New Ct
        </button>
      </div>

      {ctData.length > 0 ? (
        <div className="row">
          {ctData.map((ct) => (
            <div className="col-md-4 mb-4" key={ct._id}>
              <CtCard ct={ct} id={id} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/user/${id}/add-ct`)}
          >
            Add New Ct
          </button>
          <p>No Ct data found.</p>
        </div>
      )}
    </div>
  );
};

const CtCard = ({ ct, id, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{ct.title}</h5>
        <p className="card-text">{ct.description}</p>
        <p>
          <strong>Details:</strong> {ct.details}
        </p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/user/${id}/ct/${ct._id}`)}
          >
            Edit Ct
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(ct._id)}
          >
            Delete Ct
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ct;
