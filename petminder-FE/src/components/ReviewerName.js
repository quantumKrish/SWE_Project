import React, { useState, useEffect } from 'react';

function ReviewerName({ reviewerID }) {
  const [name, setName] = useState('Loading...');

  useEffect(() => {
    async function fetchReviewerName() {
      try {
        const response = await fetch(`http://localhost:4000/users/${reviewerID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch reviewer name');
        }
        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error('Error fetching reviewer name:', error);
        setName('Error');
      }
    }
    fetchReviewerName();
  }, [reviewerID]);

  return <span>{name}</span>;
}

export default ReviewerName;
