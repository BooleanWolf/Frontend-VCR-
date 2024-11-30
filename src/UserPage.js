import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${id}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          setError(data.message || "Failed to fetch user data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

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
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>User Profile</h3>
            </div>
            <div className="card-body">
              {/* Profile Information */}
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">
                  <strong>Email:</strong> {user.email}
                </li>
                <li className="list-group-item">
                  <strong>Name:</strong> {user.name}
                </li>
                <li className="list-group-item">
                  <strong>Department:</strong> {user.department}
                </li>
                <li className="list-group-item">
                  <strong>Phone:</strong> {user.phone}
                </li>
                <li className="list-group-item">
                  <strong>Roll:</strong> {user.roll}
                </li>
              </ul>

              {/* Edit Profile Button */}
              <div className="d-flex justify-content-end mb-4">
                <Link to={`/user/${id}/edit-profile`} className="btn btn-primary btn-sm">
                    Edit Profile
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 justify-content-center">
                <Link to={`/user/${id}/assignment`} className="btn btn-primary btn-sm">
                  Assignments
                </Link>
                <Link to={`/user/${id}/labs`} className="btn btn-secondary btn-sm">
                  Labs
                </Link>
                <Link to={`/user/${id}/class`} className="btn btn-success btn-sm">
                  Classes
                </Link>
                <Link to={`/user/${id}/cts`} className="btn btn-danger btn-sm">
                  CTS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
