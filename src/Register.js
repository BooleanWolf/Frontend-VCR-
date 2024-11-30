import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirecting

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        department: '',
        phone: '',
        roll: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate(); // Initialize navigate function

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to the API
            const response = await axios.post('http://localhost:3000/api/user/', formData);
            setSuccess(true);
            setError(null);  // Clear previous errors
            console.log('User registered successfully', response.data);

            // Redirect to login page after successful registration
            navigate('/');  // Assuming your login page is at '/login'
        } catch (err) {
            setSuccess(false);
            setError(err.response ? err.response.data.error : 'Something went wrong');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>Register</h2>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Registration Successful!</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="department" className="form-label">Department</label>
                            <input
                                type="text"
                                className="form-control"
                                id="department"
                                placeholder="Enter department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                placeholder="Enter phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="roll" className="form-label">Roll</label>
                            <input
                                type="text"
                                className="form-control"
                                id="roll"
                                placeholder="Enter roll number"
                                name="roll"
                                value={formData.roll}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
