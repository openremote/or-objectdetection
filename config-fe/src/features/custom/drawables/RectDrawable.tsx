import React from "react";
import { Rect } from 'react-konva';
import Drawable from "./drawable";

export default class RectDrawable extends Drawable {
    x: any;
    y: any;

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
      const width = this.x - this.startx;
      const height = this.y - this.starty;

      return <Rect stroke="black" x={this.startx} y={this.starty} width={width} height={height} key={this.startx + this.starty + width}/>;
    }
}