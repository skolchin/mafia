import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import { AuthContext } from './App';
import Login from './Login';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
}))

export default function Home(props) {
    const classes = useStyles();
    const [loginOpen, setLoginOpen] = React.useState(false);
    const [authState, authDispatch] = React.useContext(AuthContext);

    return(
        <div className={classes.root}>
            {authState.login 
                ? (
                    <Container>
                        <Typography>
                            Logged on as: {authState.name}
                        </Typography>
                        <Button variant="contained" color="primary" 
                        onClick={() => (authDispatch({type: 'LOGOUT'})) }>
                            Logout
                        </Button>
                    </Container>
                )
                : (
                    <Container>
                        <Typography>
                            Not authenticated
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => {setLoginOpen(true)} }>
                            Login
                        </Button>
                        <Login open={loginOpen} onClose={setLoginOpen} />
                    </Container>
                )
            }
        </div>
    );
}
