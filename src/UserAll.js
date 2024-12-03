import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserAll = () => {
  const { userId } = useParams(); // Get userId from URL
  const navigate = useNavigate(); // For navigation
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All"); // Default filter is "All"

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/${userId}/all`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
          setFilteredData(result); // Initially set filteredData to all items
        } else {
          setError(result.message || "Failed to fetch data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (filter === "All") {
      setFilteredData(data); // Show all data when "All" is selected
    } else {
      setFilteredData(data.filter((item) => item.type === filter)); // Filter by selected type
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
          className="btn btn-primary"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
        <h3>{selectedFilter === "All" ? "All Items" : `${selectedFilter} Items`}</h3>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4">
        <button
          className={`btn btn-sm ${selectedFilter === "All" ? "btn-primary" : "btn-secondary"} me-2`}
          onClick={() => handleFilterChange("All")}
        >
          All
        </button>
        <button
          className={`btn btn-sm ${selectedFilter === "CT" ? "btn-primary" : "btn-secondary"} me-2`}
          onClick={() => handleFilterChange("CT")}
        >
          CT
        </button>
        <button
          className={`btn btn-sm ${selectedFilter === "Class" ? "btn-primary" : "btn-secondary"} me-2`}
          onClick={() => handleFilterChange("Class")}
        >
          Class
        </button>
        <button
          className={`btn btn-sm ${selectedFilter === "Lab" ? "btn-primary" : "btn-secondary"} me-2`}
          onClick={() => handleFilterChange("Lab")}
        >
          Lab
        </button>
        <button
          className={`btn btn-sm ${selectedFilter === "Assignment" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => handleFilterChange("Assignment")}
        >
          Assignment
        </button>
      </div>

      {filteredData.length > 0 ? (
        <div className="row">
          {filteredData.map((item, index) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <ItemCard item={item} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
};

const ItemCard = ({ item, index }) => {
  // Adding a class for the top 3 items
  const isTopPriority = index < 3; // First 3 items are top priority
  return (
    <div className={`card shadow-sm ${isTopPriority ? "bg-warning" : ""}`} style={{ position: "relative" }}>
      {isTopPriority && (
        <div
          className="top-priority-message"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          Top Priority
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title">{item.title}</h5>
        <p className="card-text">{item.description}</p>
        <p>
          <strong>Type:</strong> {item.type}
        </p>
        <p>
          <strong>Date:</strong> {new Date(item.date).toISOString().split("T")[0]}
        </p>
        <p>
          <strong>Author:</strong> {item.author?.name || "Unknown"} (
          {item.author?.roll || "N/A"})
        </p>
      </div>
    </div>
  );
};

export default UserAll;
