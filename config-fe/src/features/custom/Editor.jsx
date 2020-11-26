import React, { useEffect, useRef } from "react";
import { Stage, Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';
import FreePathDrawable from 'features/custom/drawables/FreepathDrawable';
import CircleDrawable from 'features/custom/drawables/CircleDrawable';
import ArrowDrawable from 'features/custom/drawables/ArrowDrawable';



export default function Editor(props) {
    const layer = new Konva.Layer();
    const stage = useRef();

    let drawables = [];
    let newDrawable = [];
    let newDrawableType = "FreePathDrawable";

    getNewDrawableBasedOnType = (x, y, type) => {
        const drawableClasses = {
          FreePathDrawable,
          ArrowDrawable,
          CircleDrawable
        };
        return new drawableClasses[type](x, y);
    };

    handleMouseDown = e => {
        if (newDrawable.length === 0) {
          const { x, y } = e.target.getStage().getPointerPosition();
          const updatedNewDrawable = getNewDrawableBasedOnType(
            x,
            y,
            newDrawableType
          );
          newDrawable = [updatedNewDrawable];
        }
      };
    
      handleMouseUp = e => {
        if (newDrawable.length === 1) {
          const { x, y } = e.target.getStage().getPointerPosition();
          const drawableToAdd = newDrawable[0];
          drawableToAdd.registerMovement(x, y);
          drawables.push(drawableToAdd);
          newDrawable = [];
        }
      };
    
      handleMouseMove = e => {
        if (newDrawable.length === 1) {
          const { x, y } = e.target.getStage().getPointerPosition();
          const updatedNewDrawable = newDrawable[0];
          updatedNewDrawable.registerMovement(x, y);
          newDrawable = [updatedNewDrawable];
        }
      };

    return (
        <Stage width={props.width} height={props.height} ref={stage} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <Layer>
                {drawables.map(drawable => {
                    return drawable.render();
                })}
            </Layer>
        </Stage>
    );
}