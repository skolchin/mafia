import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import GameDrawer from './Drawer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
}))

export default function Home(props) {
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <GameDrawer />
        </div>
    );
}
