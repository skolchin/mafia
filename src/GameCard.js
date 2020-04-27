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

import PlayCircleFilledWhiteOutlined from '@material-ui/icons/PlayCircleFilledWhiteOutlined';
import Stop from '@material-ui/icons/Stop';
import AddBoxOutlined from '@material-ui/icons/AddBoxOutlined';
import PanToolOutlined from '@material-ui/icons/PanToolOutlined';

import { AuthContext } from './auth_reducer';
import { GameListContext } from './game_list_reducer';
import { GameDisplayMap } from './dict';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 350,
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
    const [auth] = React.useContext(AuthContext);
    const [gameList, gameListDispatch] = React.useContext(GameListContext);
    const game = props.game;
    const next_title = game.status === "active" ? 
        GameDisplayMap["next_period"][game.period] : 
        GameDisplayMap["next_state"][game.status];

    const handleNameChange = (text) => {
        gameListDispatch({type: 'CHANGE_NAME', payload: {id: game.id, name: text}});
    }
    const handleNextClick = () => {
        if (game.status === 'new' && !game.name ) {
            handleNameChange('Game #' + (game.id +1).toString())
        }
        gameListDispatch({type: 'NEXT_STATE', payload: {id: game.id, }});
    }
    const handleStopClick = () => {
        gameListDispatch({type: 'STOP_GAME', payload: {id: game.id, }});
    }

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
            {game.status !== "new" ? (
                <Typography component="h5" variant="h5">
                    {game.name}
                </Typography>
            ) : (
                <TextField 
                    id="name" 
                    defaultValue={game.name} 
                    placeholder="Название игры" 
                    size="small" 
                    InputProps={{ classes }}
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
                        <TableCell align="right">{game.leader.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Started</TableCell>
                        <TableCell align="right">{dateformat(game.started, 'dd.mm.yyyy HH:MM:ss')}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Round</TableCell>
                        <TableCell align="right">{game.round ? game.round : 'not started'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">{GameDisplayMap["state"][game.status]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell align="right">{game.period ? GameDisplayMap["period"][game.period] : 'not started'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Members</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2" style={{fontSize: "small"}}>
                                {"total: " + game.total}
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
                    disabled={game.status === "finish"}
                    onClick={handleNextClick}>
                    <PlayCircleFilledWhiteOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Start voting">
                <IconButton 
                    color="primary" 
                    aria-label="vote" 
                    disabled={game.status !== "active" || game.voting !== "none"}>
                    <PanToolOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Join">
                <IconButton 
                    color="primary" 
                    aria-label="join" 
                    disabled={game.status !== "start"}>
                    <AddBoxOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Stop the game">
                <IconButton 
                    color="primary" 
                    aria-label="stop" 
                    disabled={game.status === "finish"}
                    onClick={handleStopClick}>
                    <Stop/>
                </IconButton>
            </Tooltip>
        </CardActions>
      </div>
    </Card>
  );
}
