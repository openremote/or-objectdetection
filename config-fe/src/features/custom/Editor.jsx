import React, { useRef, useState } from "react";
import { Stage, Layer} from 'react-konva';
import Konva from 'konva';
import FreePathDrawable from 'features/custom/drawables/FreepathDrawable';
import CircleDrawable from 'features/custom/drawables/CircleDrawable';
import ArrowDrawable from 'features/custom/drawables/ArrowDrawable';
import RectDrawable from 'features/custom/drawables/RectDrawable';


export default function Editor(props) {
    const layer = new Konva.Layer();
    const stage = useRef();

    // Declare a new state variable, which we'll call "count"
    const [drawables, setDrawables] = useState([]);
    const [newDrawable, setNewDrawables] = useState([]);
    const [newDrawableType, setNewDrawableType] = useState("RectDrawable");

    const getNewDrawableBasedOnType = (x, y, type) => {
        const drawableClasses = {
          FreePathDrawable,
          ArrowDrawable,
          CircleDrawable,
          RectDrawable
        };
        return new drawableClasses[type](x, y);
    };

    const handleMouseDown = e => {
        if (newDrawable.length === 0) {
          const { x, y } = e.target.getStage().getPointerPosition();
          const updatedNewDrawable = getNewDrawableBasedOnType(
            x,
            y,
            newDrawableType
          );
          setNewDrawables([updatedNewDrawable]);
        }
      };
    
    const handleMouseUp = e => {
      if (newDrawable.length === 1) {
        const { x, y } = e.target.getStage().getPointerPosition();
        const drawableToAdd = newDrawable[0];
        drawableToAdd.registerMovement(x, y);
        drawables.push(drawableToAdd);
        setNewDrawables([]);
        setDrawables(drawables);
      }
    };
    
    const handleMouseMove = e => {
      if (newDrawable.length === 1) {
        const { x, y } = e.target.getStage().getPointerPosition();
        const updatedNewDrawable = newDrawable[0];
        updatedNewDrawable.registerMovement(x, y);
        setNewDrawables([updatedNewDrawable]);
      }
    };

    //combine the drawables and new drawable currently being added so we can display live drawing to the user.
    const visibleDrawables = [...drawables, ...newDrawable];
    return (  
      <div>
        <button
          onClick={e => {
            setNewDrawableType("ArrowDrawable");
          }}
        >
          Draw Arrows
        </button>
        <button
          onClick={e => {
            setNewDrawableType("CircleDrawable");
          }}
        >
          Draw Circles
        </button>
        <button
          onClick={e => {
            setNewDrawableType("RectDrawable");
          }}
        >
          Draw Rectangles
        </button>
        <button
          onClick={e => {
            setNewDrawableType("FreePathDrawable");
          }}
        >
          Draw FreeHand
        </button>
        <button
          onClick={e => {
            console.log(stage.current.toJSON());
          }}
        >
          log to JSON
        </button>
        <Stage width={props.width} height={props.height} ref={stage} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <Layer>
                {visibleDrawables.map(drawable => {
                    return drawable.render();
                })}
            </Layer>
        </Stage>
      </div>
    );
}