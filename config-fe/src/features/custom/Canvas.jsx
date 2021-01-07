import React, { useRef, useState } from "react";
import { Stage, Layer, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import { Container, Dialog, DialogContent, DialogTitle, Button, Slide, makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
    dialog: {
        padding: 0,
        marginLeft: 0,
    }
});

class Drawable {
    constructor(startx, starty) {
        this.startx = startx;
        this.starty = starty;
    }
}

class LineDrawable extends Drawable {
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
        return <Line
            points={points}
            stroke="#39FF14"
            opacity={0.8}
            strokeWidth={6}
            lineCap="round" />;
    }
}

class RectDrawable extends Drawable {
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

        return <Rect stroke="#ccff00"
            fill="rgb(204,255,0,0.1)"
            strokeWidth={3}
            x={this.startx}
            y={this.starty}
            width={width}
            height={height}
            key={this.startx + this.starty + width} />;
    }
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Canvas(props) {
    const stage = useRef();

    const [image] = useImage("https://static.dw.com/image/47113704_303.jpg");

    const [drawables, setDrawables] = useState([]);
    const [newDrawable, setNewDrawables] = useState([]);
    const [newDrawableType, setNewDrawableType] = useState("LineDrawable");
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const getNewDrawableBasedOnType = (x, y, type) => {

        const drawableClasses = {
            LineDrawable,
            RectDrawable
        };
        console.log(newDrawableType);
        console.log(type);
        console.log(newDrawable);
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDrawablesSend = (drawables) => {

        props.onDrawablesRecieve(drawables);
        handleClose();
    }

    //combine the drawables and new drawable currently being added so we can display live drawing to the user.
    const visibleDrawables = [...drawables, ...newDrawable];
    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>Open Editor</Button>
            <Dialog open={open} maxWidth={false} onClose={handleClose} TransitionComponent={Transition} className={classes.dialog}>
                <DialogContent>
                    <Container disableGutters maxWidth={false} style={{ position: 'relative' }}>
                        {/* <div className={clsx(classes.test)}/> */}

                        <Button
                            onClick={e => {
                                setNewDrawableType("LineDrawable");
                            }}
                        >
                            Draw Lines
            </Button>
                        <Button
                            onClick={e => {
                                setNewDrawableType("RectDrawable");
                            }}
                        >
                            Draw Rectangle
            </Button>
                        <Button
                            onClick={e => {

                                console.log(stage.current.toJSON());
                                console.log(image.height);
                                console.log(image.width);
                            }}
                        >
                            log to JSON
            </Button>
                        <Stage width={props.width} height={props.height} ref={stage} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
                            <Layer >
                                {/* Om image te scalen | fillPatternScaleX = requiredWidth / imageWidth -- zelfde met Heigth/Y */}
                                <Rect width={props.width} height={props.height} fillPatternImage={image} fillPatternScaleX={props.width / 700} fillPatternScaleY={props.height / 394} />
                                {visibleDrawables.map(drawable => {
                                    return drawable.render();
                                })}
                            </Layer>
                        </Stage>


                    </Container>
                    <Button style={{ marginTop: 20, marginRight: 10 }} variant="contained" color="primary" onClick={e => { handleDrawablesSend(stage.current.toJSON()) }}>Save</Button>
                    <Button style={{ marginTop: 20 }} onClick={handleClose} variant="contained" color="default">Cancel</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}