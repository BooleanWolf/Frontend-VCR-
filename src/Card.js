// Card.js
import React from 'react';

const Card = ({ title, description, time, reportTime, deadline, type }) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
                {time && <p className="card-text"><strong>Time:</strong> {time}</p>}
                {reportTime && <p className="card-text"><strong>Report Time:</strong> {reportTime}</p>}
                {deadline && <p className="card-text"><strong>Deadline:</strong> {deadline}</p>}
                <p className="card-text"><strong>Type:</strong> {type}</p>
            </div>
        </div>
    );
};

export default Card;