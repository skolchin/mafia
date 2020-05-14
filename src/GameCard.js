import React from 'react';
import dateformat from 'dateformat';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import PlayCircleFilledWhiteOutlined from '@material-ui/icons/PlayCircleFilledWhiteOutlined';
import Stop from '@material-ui/icons/Stop';
import AddBoxOutlined from '@material-ui/icons/AddBoxOutlined';
import PanToolOutlined from '@material-ui/icons/PanToolOutlined';
import MoreVertOutlined from '@material-ui/icons/MoreVertOutlined';

import { AppContext } from './app_context';
import { GameDisplayMap } from './dict';
import Backend from './backend';
import PersonName from './PersonName';
import InputBox from './InputBox';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    maxWidth: 300,
    minHeight: 265,
    display: 'flex',
    marginLeft: "5px",
    marginRight: "5px",
    marginBottom: "10px"
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  content: {
    flex: '1 0 auto',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  table: {
    display: 'flex',
    width: '100%',
  },
  withMargin: {
    marginLeft: theme.spacing(1),
  },

}));

export default function GameCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const game = props.game;
  const [state, dispatch] = React.useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const initialState = {
    name: "",
    isEditing: false,
    isSubmitting: false,
    errorMessage: null
  };
  const [data, setData] = React.useState(initialState);

  const next_title = game.status === "active" ?
    GameDisplayMap["next_period"][game.period] :
    GameDisplayMap["next_state"][game.status];

  const updateGame = (request, change_type) => {
    setData({
      ...data,
      isEditing: false,
      isSubmitting: true
    })
    fetch(Backend.GAMES_URL, request)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(resJson => {
        dispatch({
          type: change_type,
          payload: resJson
        })
        setData({
          ...data,
          isEditing: false,
          isSubmitting: false
        })
      })
      .catch(error => {
        setData({
          ...data,
          isSubmitting: false,
          isEditing: false,
        });
        props.onError(error.message || error.statusText);
      });
  }
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleInputOpen = () => {
    setAnchorEl(null);
    setData({ ...data, isEditing: true });
  };
  const handleInputClose = () => {
    setData({ ...data, isEditing: false });
  }
  const handleNameUpdate = (text) => {
    updateGame(
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          a: "update",
          game_id: game.game_id,
          user_id: state.user.user_id,
          name: text,
        })
      },
      'CHANGE_NAME')
  }
  const handleNextClick = () => {
    updateGame(
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          a: "next_state",
          game_id: game.game_id,
          user_id: state.user.user_id,
        })
      },
      'CHANGE_STATE')
  }
  const handleStopClick = () => {
    updateGame(
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          a: "stop",
          game_id: game.game_id,
          user_id: state.user.user_id,
        })
      },
      'STOP_GAME')
  }
  const handleJoinClick = () => {
    updateGame(
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          a: "join",
          game_id: game.game_id,
          user_id: state.user.user_id,
          role: null,
        })
      },
      'JOIN_GAME')
  }
  const handleMoreClick = () => {
    //        
  }
  const handleGameOpen = () => {
    handleMenuClose();
    history.push('/game/' + game.game_id.toString());
  }

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Menu
            id="menu-card"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={menuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={handleInputOpen}
              disabled={data.isSubmitting || game.status !== "new" || game.leader.user_id !== state.user.user_id}
            >
              Change name
                </MenuItem>
            <MenuItem onClick={handleGameOpen}>
              Open
                </MenuItem>
          </Menu>

          <Grid className={classes.withMargin} container direction="row" justify="space-between" alignItems="center">
            <Grid item>
              <Typography component="h5" variant="h5" >
                {game.name}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MoreVertOutlined />
              </IconButton>
            </Grid>
          </Grid>

          <Divider />
          <Table className={classes.table} size="small">
            <TableBody>
              <TableRow>
                <TableCell>Leader</TableCell>
                <TableCell align="left">
                  <Typography variant="body2">
                    {game.leader.name}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Started</TableCell>
                <TableCell align="left">
                  <Typography variant="body2" noWrap={true}>
                    {dateformat(game.started, 'dd.mm.yyyy HH:MM:ss')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell align="left">
                  <Typography variant="body2">
                    {GameDisplayMap["state"][game.status]}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Members</TableCell>
                <TableCell align="left">
                  {!game.members
                    ? <Typography variant="body2">None</Typography>
                    : <Grid container spacing={1}>
                      {game.members.map((item, index) => {
                        if (index <= 2) {
                          return (
                            <Grid key={index} item>
                              <PersonName user={item} size="small" />
                            </Grid>)
                        }
                        else if (index === 3) {
                          return (
                            <Grid key={index} item>
                              <Link href="#" onClick={handleMoreClick}>more</Link>
                            </Grid>)
                        }
                        else {
                          return null
                        }
                      })}
                    </Grid>
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>

        <CardActions className={classes.withMargin}>
          <Tooltip title={next_title}>
            <span>
              <IconButton
                color="primary"
                aria-label="next"
                disabled={data.isSubmitting || game.status === "finish" || game.leader.user_id !== state.user.user_id}
                onClick={handleNextClick}>
                {data.isSubmitting
                  ? (<CircularProgress size={20} />)
                  : (<PlayCircleFilledWhiteOutlined />)}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Start voting">
            <span>
              <IconButton
                color="primary"
                aria-label="vote"
                disabled={data.isSubmitting || game.status !== "active" || game.voting !== "none"}>
                <PanToolOutlined />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Join">
            <span>
              <IconButton
                color="primary"
                aria-label="join"
                disabled={data.isSubmitting || game.status !== "start" || !Backend.canJoin(game, state.user.user_id)}
                onClick={handleJoinClick}>
                <AddBoxOutlined />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Stop the game">
            <span>
              <IconButton
                color="primary"
                aria-label="stop"
                disabled={data.isSubmitting || game.status === "finish" || game.leader.user_id !== state.user.user_id}
                onClick={handleStopClick}>
                <Stop />
              </IconButton>
            </span>
          </Tooltip>
        </CardActions>

        <InputBox open={data.isEditing}
          onClose={handleNameUpdate}
          onCancel={handleInputClose}
          initialValue={game.name}
          title='Change game'
          prompt='Enter new game name'
          label='Value'
        />
      </div>
    </Card>
  );
}

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
  onError: PropTypes.func.isRequired,
}
