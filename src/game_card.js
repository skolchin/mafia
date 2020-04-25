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

import { changeGameName, startGame, nextPeriod } from './game';
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

    const game = props.store.getState();
    const next_title = game.state === "active" ? 
        GameDisplayMap["next_period"][game.period] : 
        GameDisplayMap["next_state"][game.state];

    const handleNameChange = (text) => {
        props.store.dispatch(changeGameName(text))
    }

    const handleNextClick = () => {
        switch(game.state) {
            case 'new':
                props.store.dispatch(startGame());
                break;

            case 'active':
                props.store.dispatch(nextPeriod());
                break;
        };
    }

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
            {game.state !== "new" ? (
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
                        <TableCell>Ведущий</TableCell>
                        <TableCell align="right">{game.leaderName}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Начало</TableCell>
                        <TableCell align="right">{dateformat(game.started, 'dd.mm.yyyy HH:MM:ss')}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Раунд</TableCell>
                        <TableCell align="right">{game.round.toString()}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Состояние</TableCell>
                        <TableCell align="right">{GameDisplayMap["state"][game.state]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Период</TableCell>
                        <TableCell align="right">{GameDisplayMap["period"][game.period]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Участники</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2" style={{fontSize: "small"}}>
                                {"всего: " + game.total}
                                <br />
                                {"граждане: " + game.citizenState[0].toString() + " из " +  game.citizenState[1].toString()}
                                <br />
                                {"мафия: " + game.mafiaState[0].toString() + " из " +  game.mafiaState[1].toString()}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Голосование</TableCell>
                        <TableCell align="right">
                            <Typography variant="body2" style={{fontSize: "small"}}>
                                {GameDisplayMap["vote"][game.voting]}
                                {game.voting !== "active" ? "" :
                                    ": " + game.voteState[0].toString() + " из " +  game.voteState[1].toString()}
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
                    disabled={game.state === "finish"}
                    onClick={handleNextClick}>
                    <PlayCircleFilledWhiteOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Начать голосование">
                <IconButton 
                    color="primary" 
                    aria-label="vote" 
                    disabled={game.state !== "active" || game.voting !== "none" || props.user.role !== "leader"}>
                    <PanToolOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Зарегистрироваться">
                <IconButton 
                    color="primary" 
                    aria-label="join" 
                    disabled={game.state !== "start" || !props.user.role === "leader"}>
                    <AddBoxOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Остановить игру">
                <IconButton 
                    color="primary" 
                    aria-label="stop" 
                    disabled={game.state !== "active" || props.user.role !== "leader"}>
                    <Stop/>
                </IconButton>
            </Tooltip>
        </CardActions>
      </div>
    </Card>
  );
}
