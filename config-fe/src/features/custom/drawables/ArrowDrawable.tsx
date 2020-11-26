import React from "react";
import { Arrow } from 'react-konva';
import Drawable from "./drawable";

export default class ArrowDrawable extends Drawable {
    constructor(startx, starty) {
      super(startx, starty);
      this.x = startx;
      this.y = starty;
    }
    registerMovement(x, y) {
      this.x = x;
      this.y = y;
    }
    render() {
      const points = [this.startx, this.starty, this.x, this.y];
      return <Arrow points={points} fill="black" stroke="black" />;
    }
}