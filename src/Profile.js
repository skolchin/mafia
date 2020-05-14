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

export default function Profile(props) {
    const classes = useStyles();
    const {match: {params}} = props.args;
    const {user_id} = params;

    return(
        <div className={classes.root}>
                <Container>
                    <Typography>
                        This eventually will become a profile displying user {user_id}
                    </Typography>
                </Container>
        </div>
    );
}
