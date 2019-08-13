import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import socketIOClient from "socket.io-client";

import logo from "../assets/logo.svg";
import dislike from "../assets/dislike.svg";
import like from "../assets/like.svg";
import itsamatch from "../assets/itsamatch.png";
import "./Main.css";
import api from "../services/api";

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("devs", {
        headers: { user: match.params.id }
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const io = socketIOClient("http://localhost:3333", {
      query: { user: match.params.id }
    });

    io.on("match", matchDev => {
      setMatchDev(matchDev);
    });
  }, [match.params.id]);

  async function handleLike(id) {
    await api.post(`devs/${id}/likes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`devs/${id}/dislikes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>

      {users.length ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />

              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>

                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Acabou :(</p>
      )}

      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It is a match" />

          <img className="avatar" src={matchDev.avatar} alt={matchDev.name} />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>
            FECHAR
          </button>
        </div>
      )}
    </div>
  );
}
