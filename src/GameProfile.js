import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
}))

export default function GameProfile(props) {
    const classes = useStyles();
    const {match: {params}} = props.args;
    const {game_id} = params;

    return(
        <div className={classes.root}>
                <Container>
                    <Typography>
                        Here would be a main game profile for game {game_id}
                    </Typography>
                </Container>
        </div>
    );
}
