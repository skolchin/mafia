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
    minWidth: 315,
    minHeight: 250,
    height: "100%",
    display: 'flex',
    marginLeft: "5px",
    marginRight: "5px",
    marginBottom: "10px"
  },
  content: {
    display: 'flex',
    alignItems: 'center',
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
    Backend.fetch(
      Backend.GAME_URL, 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({game: {name: '<New game>', leader: state.user}, action: '<new>'})
      },      
      ((resJson) => {
        setData({ ...data, isSubmitting: false })
        dispatch({
          type: "NEW_GAME",
          payload: resJson
        })
      }),
      ((error) => {
        setData({ ...data, isSubmitting: false })
        props.onError(error);
      })
    )
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
