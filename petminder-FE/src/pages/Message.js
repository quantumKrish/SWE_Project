import React, { useEffect, useState, useContext } from 'react';
import {useParams} from "react-router-dom";
import {UserContext} from "./UserContext"
import Navbar from '../components/Navbar';
import "../CSS/message-page.css"

function Message() {
  const {id} = useParams();

  const { user } = useContext(UserContext);
  const senderID = user.id;
  const receiverID = id;

  const [receiver, setReceiver] = useState(null);
  const [sendData, setSendData] = useState(null);
  const [receiveData, setReceiveData] = useState(null);
  const [message, setMessage] = useState(null);

  const sorted_logs = [];

  useEffect( () => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:4000/getuser/id/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setReceiver(data);
      } catch (err) {
        throw err;
      }
      try {
        console.log(senderID);
        console.log(receiverID);
        const res = await fetch(`http://localhost:4000/message/${senderID}/${receiverID}`);
        if (!res.ok) throw new Error("Failed to fetch sent messages");
        const data = await res.json();
        console.log(data);
        setSendData(data);
        const otherRes = await fetch(`http://localhost:4000/message/${receiverID}/${senderID}`);
        if (!otherRes.ok) throw new Error("Failed to fetch received messages");
        const data_2 = await otherRes.json();
        console.log(data_2);
        setReceiveData(data_2);
      } catch (err) {
        throw err;
      }
    }
    if (id) {
      const interval = setInterval(() => {
        fetchData();
      }, 1000);
    }
  }, [id, senderID, receiverID, message]);

  if (!receiver || !sendData || !receiveData) return <h1>Loading...</h1>;

  let i = 0;
  let j = 0;

  while (i < sendData.length && j < receiveData.length) {
    if (sendData[i].id <= receiveData[j].id) {
      sorted_logs.push(sendData[i]);
      i += 1;
    } else {
      sorted_logs.push(receiveData[j]);
      j += 1;
    }/*
    sorted_logs.push(sendData[i]);
    console.log("pushing: ", sendData[i]);
    i += 1;*/
  }

  while (i < sendData.length) {
    sorted_logs.push(sendData[i]);
    i += 1;
  }

  while (j < receiveData.length) {
    sorted_logs.push(receiveData[j]);
    j += 1;
  }

  const handleSend = async () => {
    if (message.trim()) {
      if (senderID == null || receiverID == null) {
        return
      }
      const {success} = await fetch(`http://localhost:4000/message/send/${senderID}/${receiverID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({message}),
      });
      console.log("Success: ", success);
    }
    setMessage("");
  }

  console.log("Sorted:" ,sorted_logs);

  return (
    <div>
      <Navbar />
      <h1>{`Messaging: ${receiver.username}`}</h1>
      <div className="chat-box">
        <div className="messages">
          {
            sorted_logs.length > 0 ? (
            sorted_logs.map((log, index) => (
              <span key={index} className={log.send_id === senderID ? "sender" : "receiver"}> {log.message} </span>
            ))
            ) : (
              <span> No message history </span>
            )
          }
        </div>
        <div className="inputs">
          <input
          value = {message}
          onChange={(e) => setMessage(e.target.value)}></input>
          <button className="send" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Message;
