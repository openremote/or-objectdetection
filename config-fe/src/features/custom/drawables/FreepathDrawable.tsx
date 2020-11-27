import React from "react";
import { Line } from 'react-konva';
import Drawable from "./drawable";

export default class FreePathDrawable extends Drawable {
  points: any;

  constructor(startx, starty) {
    super(startx, starty);
    this.points = [startx, starty];
  }

  registerMovement(x, y) {
    this.points = [...this.points, x, y];
  }

  render() {
    return <Line points={this.points} fill="black" stroke="black" key={this.startx + this.starty}/>;
  }
}