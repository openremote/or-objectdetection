import React from "react";
import { Stage, Layer, Line, Rect, Image as KonvaImage } from 'react-konva';
import { Container, Dialog, DialogContent, DialogTitle, Button, Slide, makeStyles } from "@material-ui/core";
import { withStyles  } from '@material-ui/core/styles';
import OfflinePlaceholder from 'assets/offline.png';

const styles = theme => ({
    dialog: {
        padding: 0,
        marginLeft: 0,
    }
})

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

class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.stage = React.createRef();

        let tempImage = new Image();
        if(this.props.snapshot) {
            let url = URL.createObjectURL(this.props.snapshot);
            tempImage.src = url;
        } else {
            tempImage.src = OfflinePlaceholder;
        }

        this.state = {
            drawables: [],
            newDrawable: [],
            newDrawableType: "LineDrawable",
            open: false,
            placeholder: tempImage
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.snapshot !== this.props.snapshot) {
            let tempImage = new Image();
            let url = URL.createObjectURL(this.props.snapshot);
            tempImage.src = url;
            this.setState({ placeholder: tempImage })
        }
      }

    getNewDrawableBasedOnType = (x, y, type) => {
        const drawableClasses = {
            LineDrawable,
            RectDrawable
        };
        return new drawableClasses[type](x, y);
    };

    handleMouseDown = e => {
        if (this.state.newDrawable.length === 0) {
            const { x, y } = e.target.getStage().getPointerPosition();
            const updatedNewDrawable = this.getNewDrawableBasedOnType(
                x,
                y,
                this.state.newDrawableType
            );
            this.setState({ newDrawable: [updatedNewDrawable]});
        }
    };

    handleMouseUp = e => {
        if (this.state.newDrawable.length === 1) {
            const { x, y } = e.target.getStage().getPointerPosition();
            const drawableToAdd = this.state.newDrawable[0];
            drawableToAdd.registerMovement(x, y);
            this.state.drawables.push(drawableToAdd);
            this.setState({ newDrawable: [], drawables: this.state.drawables});
        }
    };

    handleMouseMove = e => {
        if (this.state.newDrawable.length === 1) {
            const { x, y } = e.target.getStage().getPointerPosition();
            const updatedNewDrawable = this.state.newDrawable[0];
            updatedNewDrawable.registerMovement(x, y);
            this.setState({ newDrawable: [updatedNewDrawable]});
        }
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleDrawablesSend = (drawables) => {
        this.props.onDrawablesRecieve(drawables);
        this.handleClose();
    }

    render() {
        
        const { classes } = this.props;
                //combine the drawables and new drawable currently being added so we can display live drawing to the user.
        const visibleDrawables = [...this.state.drawables, ...this.state.newDrawable];
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>Open Editor</Button>
                <Dialog open={this.state.open} maxWidth={false} onClose={this.handleClose} TransitionComponent={Transition} className={classes.dialog}>
                    <DialogContent>
                        <Container disableGutters maxWidth={false} style={{ position: 'relative' }}>
                            {/* <div className={clsx(classes.test)}/> */}

                            <Button
                                onClick={e => {
                                    this.setState({ newDrawableType: "LineDrawable" })
                                }}
                            >
                                Draw Lines
                            </Button>
                            <Button
                                onClick={e => {
                                    this.setState({ newDrawableType: "RectDrawable" })
                                }}
                            >
                                Draw Rectangle
                            </Button>
                            <Button
                                onClick={e => {

                                    console.log(this.stage.current.toJSON());
                                    console.log(this.state.placeholder?.height);
                                    console.log(this.state.placeholder?.width);
                                }}
                            >
                                log to JSON
                            </Button>
                            <Stage width={this.props.width} height={this.props.height} ref={this.stage} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} >
                                <Layer>
                                    <KonvaImage width={this.props.width} height={this.props.height} fillPatternImage={this.state.placeholder} fillPatternScaleX={this.props.width / this.state.placeholder?.width} fillPatternScaleY={this.props.height / this.state.placeholder?.height} />
                                </Layer>
                                <Layer >
                                    {/* Om image te scalen | fillPatternScaleX = requiredWidth / imageWidth -- zelfde met Heigth/Y */}
                                    {visibleDrawables.map(drawable => {
                                        return drawable.render();
                                    })}
                                </Layer>
                            </Stage>
                        </Container>
                    <Button style={{ marginTop: 20, marginRight: 10 }} variant="contained" color="primary" onClick={e => { this.handleDrawablesSend(this.stage.current.toJSON()) }}>Save</Button>
                    <Button style={{ marginTop: 20 }} onClick={this.handleClose} variant="contained" color="default">Cancel</Button>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

}

export default withStyles(styles, {withTheme: true})(Canvas);