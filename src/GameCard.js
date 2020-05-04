import React from 'react';
import dateformat from 'dateformat';
import { makeStyles } from '@material-ui/core/styles';

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
import TextField from  '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import PlayCircleFilledWhiteOutlined from '@material-ui/icons/PlayCircleFilledWhiteOutlined';
import Stop from '@material-ui/icons/Stop';
import AddBoxOutlined from '@material-ui/icons/AddBoxOutlined';
import PanToolOutlined from '@material-ui/icons/PanToolOutlined';

import { AppContext } from './app_context';
import { GameDisplayMap } from './dict';
import Backend from './backend';
import InfoBar from './InfoBar';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
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
    flex: '1 0 auto',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  table: {
  },
  nameForm: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },  
  },
  underline: {
    "&&&:before": {
      borderBottom: "none"
    },
    "&&:after": {
      borderBottom: "none"
    }
  }
  
}));

export default function GameCard(props) {
    const classes = useStyles();
    const game = props.game;
    const [state, dispatch] = React.useContext(AppContext);

    const initialState = {
        isSubmitting: false,
        errorMessage: null
      };
    const [data, setData] = React.useState(initialState);
    
    const next_title = game.status === "active" ? 
        GameDisplayMap["next_period"][game.period] : 
        GameDisplayMap["next_state"][game.status];

    const updateGame = (fun, new_game, change_type) => {
        setData({
            ...data,
            isSubmitting: true
        })
        fun(new_game)
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
                isSubmitting: false
            })
        })
        .catch(error => {
            setData({
                ...data,
                isSubmitting: false,
                errorMessage: error.message || error.statusText
            });
        });
    }
    const handleNameChange = (text) => {
        updateGame(Backend.updateGame, {game_id: game.game_id, name: text}, 'CHANGE_NAME')
    }
    const handleNextClick = () => {
        updateGame(Backend.nextGameState, {game_id: game.game_id}, 'CHANGE_STATE')
    }
    const handleStopClick = () => {
        updateGame(Backend.stopGame, {game_id: game.game_id}, 'STOP_GAME')
    }
    const handleJoinClick = () => {
        updateGame(Backend.joinGame, {game_id: game.game_id, user_id: state.user.user_id}, 'JOIN_GAME')
    }
    const handleErrorClose = () => {
      setData({...data, errorMessage: null});
    }

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
            {game.status !== "new" || game.leader.user_id !== state.user.user_id
            ? (
                <Typography component="h5" variant="h5">
                    {game.name}
                </Typography>
            )
            : (
                <TextField 
                    id = "name"
                    autoFocus
                    margin = "dense"
                    value = {game.name} 
                    placeholder="Game title" 
                    size = "small" 
                    InputProps = {{ classes }}
                    onFocus={(ev) => {
                        ev.target.select()
                    }}
                    onChange={(ev) => {
                        game.name = ev.target.value;
                        dispatch({type: 'CHANGE_NAME', payload: game});
                    }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            handleNameChange(ev.target.value);
                            ev.preventDefault();
                        }
                      }}                    
                />
            )}
            <Divider />
            <Table className={classes.table} size="small">
                <TableBody>
                    <TableRow>
                        <TableCell>Leader</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2">
                                {game.leader.name}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Started</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2" noWrap={true}>
                                {dateformat(game.started, 'dd.mm.yyyy HH:MM:ss')}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Round</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2">
                                {game.round ? game.round : 'not started'}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2">
                                {GameDisplayMap["state"][game.status]}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2">
                                    {game.period ? GameDisplayMap["period"][game.period] : 'not started'}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Members</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2" style={{fontSize: "small"}}>
                                {"total: " + game.total[0].toString() + "/" +  game.total[1].toString()}
                                <br />
                                {"citizens: " + game.citizenState[0].toString() + "/" +  game.citizenState[1].toString()}
                                <br />
                                {"mafia: " + game.mafiaState[0].toString() + "/" +  game.mafiaState[1].toString()}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Voting</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2" style={{fontSize: "small"}}>
                                {game.voting ? GameDisplayMap["vote"][game.voting] : "not started"}
                                {game.voting !== "active" ? "" :
                                    ": " + game.voteState[0].toString() + "/" +  game.voteState[1].toString()}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
        <CardActions>
            <Tooltip title={next_title}>
                <IconButton 
                    color="primary" 
                    aria-label="next" 
                    disabled={data.isSubmitting || game.status === "finish" || game.leader.user_id !== state.user.user_id}
                    onClick={handleNextClick}>
                    {data.isSubmitting 
                        ? (<CircularProgress size={20} />) 
                        : (<PlayCircleFilledWhiteOutlined/>)}
                </IconButton>
            </Tooltip>
            <Tooltip title="Start voting">
                <IconButton 
                    color="primary" 
                    aria-label="vote" 
                    disabled={data.isSubmitting || game.status !== "active" || game.voting !== "none"}>
                    <PanToolOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Join">
                <IconButton 
                    color="primary" 
                    aria-label="join" 
                    disabled={data.isSubmitting || game.status !== "start" || game.leader.user_id === state.user.user_id}
                    onClick={handleJoinClick}>
                    <AddBoxOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Stop the game">
                <IconButton 
                    color="primary" 
                    aria-label="stop" 
                    disabled={data.isSubmitting || game.status === "finish" || game.leader.user_id !== state.user.user_id}
                    onClick={handleStopClick}>
                    <Stop/>
                </IconButton>
            </Tooltip>
        </CardActions>
        <InfoBar open={data.errorMessage} 
          severity = 'error'
          message = {data.errorMessage}
          autoHide = {3000}
          onClose = {handleErrorClose}
          />
      </div>
    </Card>
  );
}
