import React, { useState } from "react";
import {
  backLink,
  ws,
  setCurrentSession,
  getCurrentSession,
  setCurrentUser,
  getCurrentUser,
} from "../../constant/constant";
import { navigate } from "@reach/router";
import "./Login.scss";

// Cette page va changer ce sera la page de création / join d'une game pas toucher
const Login = () => {
  const [name, setName] = useState(undefined);
  const [playerName, setPlayerName] = useState(undefined);
  const [password, setPassword] = useState(undefined);

  const changeType = () => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  };

  const onClickLogin = () => {
    if (password && name) {
      fetch(`${backLink}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pass: password,
          pName: playerName,
          name: name,
        }),
      }).then(async (res) => {
        const tmp = await res.json();
        if (tmp.status === 200) {
          console.log(tmp);
          setCurrentSession(tmp.session);
          setCurrentUser(tmp.session.players[tmp.session.players.length - 1]);
		  navigate("/game");
          console.log(getCurrentSession());
        }
      });
    }
  };
  const onClickRegister = () => {
    if (password && name) {
      fetch(`${backLink}/create_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          pName: playerName,
          pass: password,
        }),
      }).then(async (res) => {
        const tmp = await res.json();
        if (tmp.status === 200) {
          setCurrentSession(tmp.session);
          setCurrentUser(tmp.session.players[tmp.session.players.length - 1]);
		  navigate("/game");
          console.log(getCurrentSession());
        }
      });
    }
  };

  return (
    <div className="contained">
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <div className="form-contain">
            <h1>Create Session</h1>
            <div className="social-container"></div>
            <input
              type="text"
              placeholder="Session name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Player name"
              onChange={(e) => {
                setPlayerName(e.target.value);
              }}
            />
            <input
              style={{ marginBottom: "5%" }}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button onClick={onClickRegister}>Create</button>
          </div>
        </div>
        <div className="form-container sign-in-container">
          <div className="form-contain">
            <h1>Join Session</h1>
            <div className="social-container"></div>
            <input
              type="text"
              placeholder="Session name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Player name"
              onChange={(e) => {
                setPlayerName(e.target.value);
              }}
            />
            <input
              style={{ marginBottom: "5%" }}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {/* <a href="#">Forgot your password?</a> */}
            <button onClick={onClickLogin}>Join</button>
          </div>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>I Join !</h1>
              <p>If you already want to join a session</p>
              <button onClick={changeType} className="ghost" id="signIn">
                Join
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Guest!</h1>
              <p>You want to create a new session?</p>
              <button onClick={changeType} className="ghost" id="signUp">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
