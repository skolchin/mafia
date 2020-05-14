import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleOutlineOutlined from '@material-ui/icons/AddCircleOutlineOutlined';

import { AppContext } from './app_context';
import Backend from './backend';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    maxWidth: 300,
    minHeight: 280,
    display: 'flex',
    marginLeft: "5px",
    marginRight: "5px",
    marginBottom: "10px"
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function NewGameCard(props) {
  const classes = useStyles();
  const [state, dispatch] = React.useContext(AppContext);

  const initialState = {
    isSubmitting: false,
  };
  const [data, setData] = React.useState(initialState);

  const handleNewGame = () => {
    setData({ ...data, isSubmitting: true })
    fetch(Backend.GAMES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        a: "new",
        user_id: state.user.user_id,
        name: '<New game>'
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(resJson => {
        dispatch({
          type: "NEW_GAME",
          payload: resJson
        })
        setData({ ...data, isSubmitting: false })
      })
      .catch(error => {
        setData({
          ...data,
          isSubmitting: false,
        });
        props.onError(error.message || error.statusText);
      });
  }

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <>
          <IconButton
            color="inherit"
            aria-label="new game"
            onClick={handleNewGame}
            disabled={data.isSubmitting}
          >
            {data.isSubmitting
              ? <CircularProgress />
              : <AddCircleOutlineOutlined color="disabled" style={{ fontSize: 100 }} />}
          </IconButton>
          <Typography variant="h6" noWrap>New game</Typography>
        </>
      </CardContent>
    </Card>
  );
}

NewGameCard.propTypes = {
  onError: PropTypes.func.isRequired,
}
