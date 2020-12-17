import React from "react";
import { Container, Dialog, DialogContent, DialogTitle, Button, Slide, makeStyles } from "@material-ui/core";
import Canvas from './Canvas'
import { DesktopWindows } from "@material-ui/icons";

const useStyles = makeStyles({

    dialog: {
        padding: 0,
        marginLeft: 0,
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Editor() {
    const [open, setOpen] = React.useState(false);
    const [drawables, setDrawables] = React.useState();
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDrawables = (drawables) => {
        console.log(drawables);
        this.setDrawables(drawables);
    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>Open Editor</Button>
            <Dialog open={open} maxWidth={false} onClose={handleClose} TransitionComponent={Transition} className={classes.dialog}>
                <DialogContent>
                    <Container disableGutters maxWidth={false} style={{ position: 'relative' }}>
                        {/* <div className={clsx(classes.test)}/> */}
                        <Canvas width={1280} height={720} onDrawablesRecieve={handleDrawables} />
                    </Container>
                    <Button style={{ marginTop: 20, marginRight: 10 }} variant="contained" color="primary">Save</Button>
                    <Button style={{ marginTop: 20 }} onClick={handleClose} variant="contained" color="default">Cancel</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}