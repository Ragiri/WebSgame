import React, { useEffect } from "react";
import * as PIXI from "pixi.js";
import {
  ws,
  getCurrentSession,
  getCurrentUser,
  setCurrentSession,
  setCurrentUser,
} from "../../constant/constant";
import { navigate } from "@reach/router";

const Game = () => {
  const test = async () => {
    ws.onopen = function (event) {};

    ws.onmessage = function (event) {
      var message = JSON.parse(event.data);
      //console.log(message);
      setCurrentSession(message.session);
      if (message.player.id === getCurrentUser().id)
        setCurrentUser(message.player);
    };
  };
  useEffect(() => {
    test();
    const app = new PIXI.Application({
      width: 8000,
      height: 8000,
      backgroundColor: 0xe6e6e6,
      resolution: window.devicePixelRatio || 1,
    });
    document.getElementById("Point_game").appendChild(app.view);
    const graphics = new PIXI.Graphics();
    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 500,
      fontWeight: "bold",
      fill: ["#c998f8", "#9cb6fd"], // gradient
      stroke: "#FFFFFF",
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });
    const movementSpeed = 0.05; // a changer avec  la taille

    function checkCol(object1, object2) {
      const bounds1 = object1.getBounds();
      const bounds2 = object2.getBounds();

      return (
        bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y
      );
    }

    function collisionResponse(object1, object2) {
      if (!object1 || !object2) {
        return new PIXI.Point(0);
      }

      const vCollision = new PIXI.Point(
        object2.x - object1.x,
        object2.y - object1.y
      );

      const distance = Math.sqrt(
        (object2.x - object1.x) * (object2.x - object1.x) +
          (object2.y - object1.y) * (object2.y - object1.y)
      );

      const vCollisionNorm = new PIXI.Point(
        vCollision.x / distance,
        vCollision.y / distance
      );

      return new PIXI.Point(vCollisionNorm.x, vCollisionNorm.y);
    }

    function distanceBetweenTwoPoints(p1, p2) {
      const a = p1.x - p2.x;
      const b = p1.y - p2.y;

      return Math.hypot(a, b);
    }

    var player = new PIXI.Graphics();
    console.log(getCurrentUser());
    player.beginFill(getCurrentUser().color, 1);
    //x, y, radius
    player.drawCircle(0, 0, getCurrentUser().score / 10 / 2);
    player.endFill();
    player.radius = getCurrentUser().score / 10 / 2;
    player.position.set(
      getCurrentUser().position.x,
      getCurrentUser().position.y
    );

    console.log();
    player.acceleration = new PIXI.Point(0);
    player.mass = getCurrentUser().score * 0.003;

    const container = new PIXI.Container();
    const containerP = new PIXI.Container();
    getCurrentSession().point.map((item) => {
      var p2temp = new PIXI.Graphics();
      p2temp.beginFill(item.color, 1);
      //x, y, radius
      p2temp.drawCircle(item.position.x, item.position.y, item.size.r);
      p2temp.endFill();
      p2temp.mass = 5;
      p2temp.acceleration = new PIXI.Point(0);
      container.addChild(p2temp);
    });

    const richText = new PIXI.Text(getCurrentUser().score, style);
    richText.x = 50;
    richText.y = 220;
    app.ticker.add((delta) => {
      if (!getCurrentUser().status) {
        ws.close();
        localStorage.clear();
        window.location.href = window.location.origin;
      }
      containerP.removeChildren();
      player.acceleration.set(
        player.acceleration.x * 0.99,
        player.acceleration.y * 0.99
      );

      const mouseCoords = app.renderer.plugins.interaction.mouse.global;

      if (
        app.screen.width > mouseCoords.x ||
        mouseCoords.x > 0 ||
        app.screen.height > mouseCoords.y ||
        mouseCoords.y > 0
      ) {
        //pop j2 au millieu
        const playerCenterPosition = new PIXI.Point(
          player.x + player.radius,
          player.y + player.radius
        );

        // suit la souris
        const toMouseDirection = new PIXI.Point(
          mouseCoords.x - playerCenterPosition.x,
          mouseCoords.y - playerCenterPosition.y
        );

        // angle souris
        const angleToMouse = Math.atan2(toMouseDirection.y, toMouseDirection.x);

        // vitesse pas rapport distance pointer changer par ratio vitesse taille
        const distMouseplayer = distanceBetweenTwoPoints(
          mouseCoords,
          playerCenterPosition
        );
        const redSpeed = distMouseplayer * movementSpeed;

        getCurrentSession().players.map((item) => {
          var p2temp = new PIXI.Graphics();
          p2temp.beginFill(item.color, 1);
          //x, y, radius
          p2temp.drawCircle(
            item.position.x,
            item.position.y,
            item.score / 10 / 2
          );
          p2temp.endFill();
          p2temp.mass = 1;
          p2temp.radius = item.score / 10 / 2;
          p2temp.acceleration = new PIXI.Point(0);
          containerP.addChild(p2temp);
        });

        getCurrentSession().point.map((item, index) => {
          const child = container.getChildAt(index);
          child.acceleration.set(
            child.acceleration.x * 0.99,
            child.acceleration.y * 0.99
          );
          if (checkCol(child, player)) {
            const collisionPush = collisionResponse(child, player);
            player.acceleration.set(
              collisionPush.x * child.mass,
              collisionPush.y * child.mass
            );
            ws.send(
              JSON.stringify({
                type: "point_colision",
                sessionId: getCurrentSession().id,
                playerId: getCurrentUser().id,
                pointId: item.id,
              })
            );
            const find = getCurrentSession().point.find(
              (el) => el.id === item.id
            );
            child.position.set(find.position.x, find.position.y);
          }
          child.x += child.acceleration.x * delta;
          child.y += child.acceleration.y * delta;
        });

        getCurrentSession().players.map((item, index) => {
          const child = containerP.getChildAt(index);
          child.acceleration.set(
            child.acceleration.x * 0.99,
            child.acceleration.y * 0.99
          );
          if (
            item.id !== getCurrentUser().id &&
            item.status &&
            checkCol(child, player)
          ) {
            const collisionPush = collisionResponse(child, player);
            player.acceleration.set(
              collisionPush.x * child.mass,
              collisionPush.y * child.mass
            );
            console.log("hey");
            ws.send(
              JSON.stringify({
                type: "player_colision",
                sessionId: getCurrentSession().id,
                FplayerId: getCurrentUser().id,
                SplayerId: item.id,
              })
            );
            const find = getCurrentSession().players.find(
              (el) => el.id === item.id
            );
            child.position.set(find.position.x, find.position.y);
          }
          child.x += child.acceleration.x * delta;
          child.y += child.acceleration.y * delta;
        });
        //
        // vitesse pas rapport a l'angle
        player.acceleration.set(
          Math.cos(angleToMouse) * redSpeed,
          Math.sin(angleToMouse) * redSpeed
        );
      }

      player.mass = getCurrentUser().score * 0.003;
      if (getCurrentUser().score > 900)
        player.scale.set(
          (getCurrentUser().score - 500) / 500,
          (getCurrentUser().score - 500) / 500
        );
	  richText.text = getCurrentUser().score
      player.x += player.acceleration.x * delta;
      player.y += player.acceleration.y * delta;
      ws.send(
        JSON.stringify({
          type: "update_position",
          sessionId: getCurrentSession().id,
          playerId: getCurrentUser().id,
          position: { x: player.x, y: player.y },
        })
      );
    });

    app.stage.addChild(richText);
    app.stage.addChild(container);
    app.stage.addChild(containerP);
    if (getCurrentUser().status) app.stage.addChild(player);
    app.stage.addChild(graphics);
  });
  return <div id="Point_game"></div>;
};

export default Game;
