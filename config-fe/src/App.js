import React from 'react';
import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Paper, Typography, CardActions, Card, CardContent } from '@material-ui/core';
import Image from '../src/Images/CamPlaceholder.PNG';

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  container: {
    position: 'absolute',
    minHeight: 600,
    minHeight: 800,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'solid',
    borderRadius: 15,
  },
  card: {
    minWidth: 275,
    minHeight: 220,
    backgroundImage: `url(${Image})`,
    backgroundSize: '100%'
  }
});

{/* <Button variant="contained" color="primary">
                Hello World
              </Button> */}

function App() {
  const classes = useStyles();

  return (



    <Container className={classes.container} maxWidth="md" >
      <Grid item xs={12}>
        <Grid container justify="center" spacing={4}>

          {/* Voegt 3 cards toe */}
          {[0, 1, 2].map((value) => (
            <Grid key={value} item>

              {/* Card met content */}
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Camera 1
                  </Typography>
                  <Typography variant="h5" component="h2">
                    Hallway
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    Building TQ
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button size="small">ADD</Button>
                </CardActions>
              </Card>


            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
