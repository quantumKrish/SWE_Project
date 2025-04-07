import React, { useState, useEffect, useContext } from "react";
import {useParams} from "react-router-dom";
import {UserContext} from "./UserContext"

import Navbar from '../components/Navbar.js'
const ReportMinder = () => {
  const { userid } = useParams();

  const [title, setTitle] = useState("");
  const [reportedUser, setReportedUser] = useState(null);
  const [description, setDescription] = useState("");

  const {user} = useContext(UserContext);

  useEffect( () => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:4000/getuser/id/${userid}`);
        if (!res.ok) throw new Error("Error failure getting user details!");
        const data = await res.json();
        setReportedUser(data);
      } catch(error) {
        throw error;
      }
    }
    fetchData();
    }, [userid]);

  const handleSubmit = async () => {
    if (description.trim()) {
      if (userid == null) return
      const response = await fetch(`http://localhost:4000/report/${user.id}/${userid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userid,
          by: user.id,
          title: title,
          description: description
        }),
      });
      alert(await response.json());
    }
  }

  if (!reportedUser) return <p>Loading...</p>

  return (
    <div>
      <h1>Report {reportedUser.username}</h1>
      <br />

      <label>Reason</label>
      <br />
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rows={1}
        cols={40}
        placeholder="Enter title here..."
      />
      <br />

      <label>Description:</label>
      <br />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        cols={40}
        placeholder="Enter main report here..."
      />

      <br />
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Submit Report
      </button>


      <Navbar />
    </div>
  );
};

export default ReportMinder;
