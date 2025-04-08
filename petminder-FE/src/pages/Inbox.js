import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Navbar from '../components/Navbar';
import "../CSS/inbox.css";

function Inbox() {
  const [messageID, setMessageID] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const user_ID = user.id;

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`http://localhost:4000/message/list/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_ID }),
      });
      const messages = await response.json();
      setMessageID(messages);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="message-page-container">
      <Navbar />
      <h1>Inbox</h1>
      <div className="inbox-container">
        {
          messageID.length > 0 ? (
            messageID.map((log, index) => (
              <Link to={`/message/${log.id}`} key={index} className="inbox-link">
                <div className="inbox-card">{log.username}</div>
              </Link>
            ))
          ) : (
            <p className="empty-inbox">Empty Inbox</p>
          )
        }
      </div>
    </div>
  );
}

export default Inbox;
