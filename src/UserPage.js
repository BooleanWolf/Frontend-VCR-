import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [createdClassrooms, setCreatedClassrooms] = useState([]);
  const [joinedClassrooms, setJoinedClassrooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [classroomError, setClassroomError] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");

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

    const fetchClassrooms = async () => {
      try {
        const createdResponse = await fetch(
          `http://localhost:3000/api/classroom/${id}/created_classrooms`
        );
        const createdData = await createdResponse.json();
        console.log("Created Classrooms:", createdData);  // Debugging log

        const joinedResponse = await fetch(
          `http://localhost:3000/api/classroom/${id}/joined_classrooms`
        );
        const joinedData = await joinedResponse.json();
        console.log("Joined Classrooms:", joinedData);  // Debugging log

        if (createdResponse.ok) setCreatedClassrooms(createdData);
        if (joinedResponse.ok) setJoinedClassrooms(joinedData);

        if (!createdResponse.ok || !joinedResponse.ok) {
          setClassroomError("Failed to fetch classrooms.");
        }
      } catch (err) {
        setClassroomError("Something went wrong while fetching classrooms.");
      }
    };

    fetchUserData();
    fetchClassrooms();
  }, [id]);

  const handleJoinClassroom = async () => {
    if (!joinCode) {
      alert("Please enter a classroom code.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/classroom/${id}/join/${joinCode}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Successfully joined the classroom!");
        setJoinedClassrooms((currentJoinedClassrooms) => [
          ...(Array.isArray(currentJoinedClassrooms) ? currentJoinedClassrooms : []),
          data,
        ]);
        setShowJoinModal(false);
        setJoinCode("");
      } else {
        alert(data.message || "Failed to join classroom.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLeaveClassroom = async (classroomId, code) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/classroom/${id}/leave/${code}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Successfully left the classroom!");
        setJoinedClassrooms((currentJoinedClassrooms) =>
          (Array.isArray(currentJoinedClassrooms) ? currentJoinedClassrooms : []).filter(
            (classroom) => classroom._id !== classroomId
          )
        );
      } else {
        alert(data.message || "Failed to leave classroom.");
      }
    } catch (err) {
      alert("Something went wrong while leaving the classroom.");
    }
  };

  const handleDeleteClassroom = async (classroomId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/classroom/${classroomId}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Classroom deleted successfully!");
        setCreatedClassrooms((currentClassrooms) =>
          currentClassrooms.filter((classroom) => classroom._id !== classroomId)
        );
      } else {
        alert(data.message || "Failed to delete classroom.");
      }
    } catch (err) {
      alert("Something went wrong while deleting the classroom.");
    }
  };

  const closeJoinModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowJoinModal(false);
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
              <div className="d-flex gap-2 justify-content-center mb-4">
                <Link to={`/user/${id}/assignment`} className="btn btn-primary btn-sm">
                  Assignments
                </Link>
                <Link to={`/user/${id}/labs`} className="btn btn-warning btn-sm">
                  Labs
                </Link>
                <Link to={`/user/${id}/class`} className="btn btn-success btn-sm">
                  Classes
                </Link>
                <Link to={`/user/${id}/cts`} className="btn btn-danger btn-sm">
                  CTS
                </Link>
                <Link to={`/user/${id}/all`} className="btn btn-danger btn-sm">
                  All
                </Link>
              </div>

              {/* Create Classroom Button */}
              <div className="text-center mb-4">
                <Link to={`/user/${id}/create-classroom`} className="btn btn-success btn-lg">
                  Create Classroom
                </Link>
              </div>

              {/* Join Classroom Button */}
              <div className="text-center mb-4">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowJoinModal(true)}
                >
                  Join Classroom
                </button>
              </div>

              {/* Join Classroom Modal */}
              {showJoinModal && (
                <div className="modal show" style={{ display: "block" }} onClick={closeJoinModal}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Join Classroom</h5>
                        <button type="button" className="btn-close" onClick={() => setShowJoinModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Classroom Code"
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value)}
                        />
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowJoinModal(false)}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleJoinClassroom}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Created Classrooms */}
              <div>
                <h5>Created Classrooms</h5>
                {createdClassrooms.length > 0 ? (
                  <ul className="list-group">
                    {createdClassrooms.map((classroom) => {
                      console.log(classroom);  // Debugging log
                      return (
                        <li key={classroom._id} className="list-group-item d-flex justify-content-between align-items-center">
                          <Link to={`/user/${id}/classroom/${classroom._id}`}>
                            {classroom.title ? classroom.title : 'No name'}
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteClassroom(classroom._id)}
                          >
                            Delete
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No classrooms created yet.</p>
                )}
              </div>

              {/* Joined Classrooms */}
              <div>
                <h5>Joined Classrooms</h5>
                {joinedClassrooms.length > 0 ? (
                  <ul className="list-group">
                    {joinedClassrooms.map((classroom) => (
                      <li key={classroom._id} className="list-group-item d-flex justify-content-between align-items-center">
                         <Link to={`/user/${id}/classroom/${classroom._id}`}>
                            {classroom.title ? classroom.title : 'No name'}
                          </Link> {/* Ensure classroom name is displayed */}
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleLeaveClassroom(classroom._id, classroom.code)}
                        >
                          Leave
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No classrooms joined yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
