import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import Navbar from '../components/Navbar';
import "../CSS/message-page.css"

function Message() {
  const {id} = useParams();

  console.log(id)

  const [user, setUser] = useState(null);

  useEffect( () => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:4000/getuser/id/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        throw err;
      }
    }
    fetchData();
  }, [id]);

  if (!user) return <h1>Loading...</h1>;

  return (
    <div>
      <Navbar />
      <h1>{`Messaging: ${user.username}`}</h1>
      <div className="chat-box">
        <div className="messages">
          <p> hello </p>
        </div>
        <div className="inputs">
          <input></input>
          <button className="send">Send</button>
        </div>
      </div>
    </div>
  );
}

export default Message;
