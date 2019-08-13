import React, { useState } from "react";

import logo from "../assets/logo.svg";
import api from "../services/api";
import "./Login.css";

export default function Login({ history }) {
  const [username, setUsername] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post("devs", { username });

    const { _id } = response.data;

    history.push(`dev/${_id}`);
  }

  function handleChange(e) {
    setUsername(e.target.value);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" />

        <input
          type="text"
          placeholder="Digite seu login no Github"
          value={username}
          onChange={handleChange}
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
