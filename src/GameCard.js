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
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

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
import InfoBar from './InfoBar';

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
  const [state, dispatch] = React.useContext(AppContext);
  const game = props.game;

  const initialState = {
    name: "",
    isEditing: false,
    isSubmitting: false,
    isConfirmStop: false,
    errorMessage: null
  };
  const [data, setData] = React.useState(initialState);
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [moreAnchor, setMoreAnchor] = React.useState(null);

  const next_title = game.status === "active" ?
    GameDisplayMap["next_period"][game.period] :
    GameDisplayMap["next_state"][game.status];

  const updateGame = (upd) => {
    setData({...data, isEditing: false, isSubmitting: true, isConfirmStop: false });
    Backend.post(
      Backend.GAME_URL, 
      upd,
      ((resJson) => {
        setData({...data, isEditing: false, isSubmitting: false, isConfirmStop: false, });
        dispatch({type: 'GAME_UPDATE', payload: resJson});
      }),
      ((error) => {
        setData({...data, isEditing: false, isSubmitting: false, isConfirmStop: false, });
        props.onError(error);
      })
    )
  }
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleInputOpen = () => {
    handleMenuClose();
    setData({ ...data, isEditing: true });
  };
  const handleInputClose = () => {
    setData({ ...data, isEditing: false });
  }
  const handleMoreOpen = (event) => {
    setMoreAnchor(event.currentTarget);
  };
  const handleMoreClose = () => {
    setMoreAnchor(null);
  };
  const handleNameUpdate = (text) => {
    updateGame({
      game: {_id: game._id, name: text}, 
      user: {_id: state.user._id},
      action: '<name>'
    })
  }
  const handleNextClick = () => {
    updateGame({
      game: {_id: game._id, status: game.status, period: game.period, }, 
      user: {_id: state.user._id},
      action: '<next>'
    })
  }
  const handleStopClick = () => {
    setData({ ...data, isConfirmStop: true });
  }
  const handleGameStop = () => {
    updateGame({
      game: {_id: game._id, status: game.status}, 
      user: {_id: state.user._id},
      action: '<stop>'
    })
  }
  const handleInfoClose = () => {
    setData({ ...data, isConfirmStop: false });
  }
  const handleJoinClick = () => {
    updateGame({
      game: {_id: game._id, status: game.status}, 
      user: {_id: state.user._id, role: null}, 
      action: '<join>'
    })
  }
  const handleGameOpen = () => {
    handleMenuClose();
    history.push('/game/' + game._id.toString());
  }

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Menu
            id="menu-card"
            anchorEl={menuAnchor}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={handleInputOpen}
              disabled={data.isSubmitting || (game.status !== "new" && game.status !== "start") || game.leader._id !== state.user._id}
            >
              Change name
            </MenuItem>
            <MenuItem onClick={handleGameOpen}>
              Open
            </MenuItem>
          </Menu>
          <Popover
            id="members"
            open={Boolean(moreAnchor)}
            anchorEl={moreAnchor}
            onClose={handleMoreClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Grid container direction="column" style={{padding: "5px"}}>
              {game.members.map((item, index) => 
                <Grid key={index} item  style={{padding: "2px"}}>
                  <PersonName user={item} size="small" asChip showName />
                </Grid>
              )}
            </Grid>
          </Popover>    

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
                  <PersonName user={game.leader} size="small" showName asChip />
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
                  <Typography variant="body2" style={{"text-transform": "capitalize"}}>
                    {game.status !== 'active' 
                      ? GameDisplayMap["state"][game.status] 
                      : `${game.period}: ${game.round}, alive: ${game.stats.total[1]}`}
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
                              <Link href="#" onClick={handleMoreOpen} style={{fontSize: -1}}>more</Link>
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
          <Button
            color="primary"
            aria-label="open"
            disabled={data.isSubmitting}
            onClick={handleGameOpen}
          >
            Open
          </Button>

          <Tooltip title={next_title}>
            <span>
              <IconButton
                color="primary"
                aria-label="next"
                disabled={data.isSubmitting || game.status === "finish" || game.status === "cancel" || game.leader._id !== state.user._id}
                onClick={handleNextClick}
              >
                {data.isSubmitting
                  ? (<CircularProgress size={20} />)
                  : (<PlayCircleFilledWhiteOutlined />)}
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Vote">
            <span>
              <IconButton
                color="primary"
                aria-label="vote"
                disabled={data.isSubmitting || game.status !== "active" || game.voting !== "none"}
              >
                <PanToolOutlined />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Join">
            <span>
              <IconButton
                color="primary"
                aria-label="join"
                disabled={data.isSubmitting || game.status !== "start" || !Backend.canJoin(game, state.user._id)}
                onClick={handleJoinClick}
              >
                <AddBoxOutlined />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Stop the game">
            <span>
              <IconButton
                color="primary"
                aria-label="stop"
                disabled={data.isSubmitting || game.status === "finish" || game.status === "cancel" || game.leader._id !== state.user._id}
                onClick={handleStopClick}
              >
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

        <InfoBar open={data.isConfirmStop} 
          severity='info'
          message={'Cancel game "' + game.name + '"?'}
          action="YES"
          onClose={handleInfoClose}
          onClick={handleGameStop}
          />


      </div>
    </Card>
  );
}

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
  onError: PropTypes.func.isRequired,
}
