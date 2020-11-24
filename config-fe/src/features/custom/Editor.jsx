import React, { useEffect, useRef } from "react";
import { Stage, Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';



export default function Editor(props) {
    const layer = new Konva.Layer();
    const stage = useRef();

    let arrow;

    useEffect( () => {
        //stage.current.add(layer);
    }, []);


    const handleMouseDown = (e) => {
        console.log("HOI");
        const pos = stage.current.getPointerPosition();
        arrow = new Konva.Arrow({
            points: [pos.x, pos.y],
            stroke: 'black',
            fill: 'black'
        });
        layer.add(arrow);
        layer.batchDraw();
    };

    const handleMouseMove = (e) => {
        console.log("HOI");
        if (arrow) {
            const pos = stage.current.getPointerPosition();
            const points = [arrow.points()[0], arrow.points()[1], pos.x, pos.y];
            arrow.points(points);
            layer.batchDraw();
        }
    };

    const handleMouseUp = (e) => {
        console.log("HOI");
        arrow = null;
    }

    return (
        <Stage width={props.width} height={props.height} >
            <Layer onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} ref={stage}>
                <Rect width={50} height={50} fill="red" />
                <Circle x={200} y={200} stroke="black" radius={50} />
            </Layer>
        </Stage>
    );
}