import React, { useEffect, useState, useContext } from 'react';
import {Link, useParams} from "react-router-dom";
import {UserContext} from "./UserContext"
import Navbar from '../components/Navbar';
import "../CSS/message-page.css"

function Inbox() {
  const [messageID, setMessageID] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(UserContext);
  const user_ID = user.id;

  useEffect( () => {
    async function fetchData() {
      const response = await fetch(`http://localhost:4000/message/list/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({user_ID}),
      });
      const messages = await response.json();
      console.log(messages);
      setMessageID(messages);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div>
      <Navbar />
      <h1> Inbox </h1>
      {
        messageID.length > 0 ? (
        messageID.map((log, index) => (
          <Link to={`/message/${log.id}`}>{log.username}</Link>
        ))) : (
          <p> Empty Inbox </p>
        )
      }
    </div>
  );
}

export default Inbox;

