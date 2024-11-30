// Modal.js
import React from 'react';

const Modal = ({ show, handleClose, handleSubmit, handleInputChange, formData, currentType }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h5>{`Add ${currentType.charAt(0).toUpperCase() + currentType.slice(1)}`}</h5>
                    <button className="close" onClick={handleClose}>X</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {(currentType === 'assignment' || currentType === 'class' || currentType === 'ct') && (
                            <div className="mb-3">
                                <label htmlFor="time" className="form-label">Time</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}
                        {currentType === 'assignment' && (
                            <div className="mb-3">
                                <label htmlFor="deadline" className="form-label">Deadline</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="deadline"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">Add {currentType.charAt(0).toUpperCase() + currentType.slice(1)}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
