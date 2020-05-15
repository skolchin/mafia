import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from  '@material-ui/core/Tooltip';

import SentimentSatisfiedAltOutlined from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVeryDissatisfiedOutlined from '@material-ui/icons/SentimentVeryDissatisfiedOutlined';
import ThumbUpOutlined from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlined from '@material-ui/icons/ThumbDownOutlined';

import { PersonDisplayMap } from './dict';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    display: 'flex',
    marginBottom: "10px"
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    minWidth: 200,
    minHeight: 140,
  },
  avatar: {
    width: 140,
    height: 140,
    marginTop: "5px",
    marginBottom: "5px",
    marginRight: "5px"
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  }
}));

export default function PersonCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {props.person.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {props.person.state !== "alive" || props.person.id === props.user.id || props.person.role === "leader" ?
              PersonDisplayMap["role"][props.person.role] : PersonDisplayMap["role"]["unknown"]}
          </Typography>
        </CardContent>
        <div className={classes.actions}>
            <Tooltip title={PersonDisplayMap["state"][props.person.state]}>
              {props.person.state === "alive" ? 
                  <SentimentSatisfiedAltOutlined style={{ color: "#00FF00" }} /> :
                  <SentimentVeryDissatisfiedOutlined  style={{ color: "#808080" }} />
              }
            </Tooltip>
            <Tooltip title="Reborn">
              <IconButton color="primary" aria-label="up" disabled="true">
                  <ThumbUpOutlined/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Kill">
              <IconButton 
                color="primary" 
                aria-label="down" 
                disabled={props.person.role === "leader" || !props.user.votingAllowed || props.person.id === props.user.id}>
                  <ThumbDownOutlined />
              </IconButton>
            </Tooltip>
        </div>
      </div>
      <CardMedia
        className={classes.avatar}
        image={process.env.PUBLIC_URL + "/" + props.person.avatar}
        width="140"
        title={props.person.name}
      />
    </Card>
  );
}
