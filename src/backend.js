import querystring from "querystring";

export default class Backend {
  static HOST = 'http://localhost:5000';
  static AUTH_URL = this.HOST + '/api/v1/auth';
  static AVATAR_URL = this.HOST + '/api/v1/photo';
  static GAMES_URL = this.HOST + '/api/v1/games';
  static GAME_URL = this.HOST + '/api/v1/game';
  static MESSAGES_URL = this.HOST + '/api/v1/updates';
  static USER_URL = this.HOST + '/api/v1/user';
  static PHOTO_URL = this.HOST + '/api/v1/set_photo';

  static INITIAL_USER_STATE = {
    _id: null,
    name: null,
  }
  static INITIAL_GAME_STATE = {
    _id: null,
    name: null,
    started: null,
    round: null,
    status: "new",
    period: null,
    leader: null,
    members: []
  }
  static INITIAL_MESSAGE_STATE = {
    msg_type: null,
    received: null,
    message: null,
  }
  static INITIAL_APP_STATE = {
    user: this.INITIAL_USER_STATE,
    games: [],
    messages: [],
    lastMessage: null,
  };

  static avatarURL(user) {
    return !user ? null : this.AVATAR_URL + '?user_id=' + user._id;
  }
  static nameInitials(user) {
    if (!user || !user.displayName)
      return null
    else {
      var parts = user.displayName.toUpperCase().split(' ')
      return parts[0][0] + (parts.length > 1 ? parts[1][0] : '')
    }
  }
  static canJoin(game, user_id) {
    return game.leader._id !== user_id && game.members.findIndex(m => m._id === user_id) === -1
  }
  static getGameStatusMessage(game, change) {
    switch (change.status) {
      case 'start':
        return 'Registration for game "' + game.name + '" has started'
      case 'active':
        return 'Game "' + game.name + '" has started'
      case 'finish':
        return 'Game "' + game.name + '" has finished'
      case 'cancel':
        return 'Game "' + game.name + '" has cancelled'
      default:
        return 'Game "' + game.name + '" status has changed to ' + change.status;
    }
  }
  static fetch(url, options, okHandler, errorHandler) {
    fetch(url, options)
      .then(res => {
        if (res.ok)
          return res.json();
        throw res;
      })
      .then(resJson => {
        if (!resJson.success)
          errorHandler(resJson.message, resJson.error)
        else
          okHandler(resJson.data, resJson.token)
      })
      .catch(error => errorHandler(error.message || error.statusText, null))
  }

  static get(url, query, okHandler, errorHandler) {
    const token = localStorage.getItem('token');
    return Backend.fetch(
      url + '?' + query,
      {
        method: 'GET',
        headers: token ? { 'Authorization': 'Bearer ' + token } : {},
        credentials: "same-origin",
      },
      okHandler,
      errorHandler
    )
  }
  static post(url, content, okHandler, errorHandler) {
    const token = localStorage.getItem('token');
    const authHeader = token 
      ? { "Content-Type": "application/json", 'Authorization': 'Bearer ' + token } 
      : {"Content-Type": "application/json"};

    return Backend.fetch(
      url,
      {
        method: 'POST',
        headers: authHeader,
        credentials: "same-origin",
        body: JSON.stringify(content),
      },
      okHandler,
      errorHandler
    )
  }

  static eventSource = null;
  static createEventSource(window) {
    if (!Backend.eventSource) {
      /*Backend.eventSource = new EventSource(Backend.MESSAGES_URL + '?user_id=' + resJson.user._id);
      const listener  = (e) => {
        console.log('New event');
        dispatch({
          type: e.type.toUpperCase(),
          payload: JSON.parse(e.data),
        })
      }
      Backend.eventSource.addEventListener('msg_game_update', listener);*/

      window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        if (Backend.eventSource) {
          Backend.eventSource.close();
          Backend.eventSource = null;
        }
      })
    }
  }

  static getQuery(loc) {
    //ignoreQueryPrefix doesn't work
    const x = loc.search;
    return querystring.parse(x && x[0] === '?' ? x.substring(1) : x);
  }
}

