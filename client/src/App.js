import React from "react";
import { Router, Location } from "@reach/router";

import Game from './component/game/Game'   /* importe la page ou il y aura le jeu*/
import Login from "./component/login/Login";

import "./style.scss";
const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id="routerhang">
        <div key={location.key}>
          <Router location={location}>{children}</Router>
        </div>
      </div>
    )}
  </Location>
);

const App = () => {
  return (
    <div className="wraper">
      <PosedRouter>
        <Login path="/" />
        <Game path="/game" />
      </PosedRouter>
    </div>
  );
};

export default App;
