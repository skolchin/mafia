export default class Backend {
    static HOST = 'http://localhost:5000';
    static AUTH_URL = this.HOST + '/api/v1/auth';
    static AVATAR_URL = this.HOST + '/api/v1/a';
    static GAMES_URL = this.HOST + '/api/v1/games';
    static MESSAGES_URL = this.HOST + '/api/v1/m';

    static INITIAL_USER_STATE = {
        _id: null,
        login: null,
        name: null,
    }
    static INITIAL_GAME_STATE = {
        _id: null,
        name: null,
        started: null,
        round: null,
        status: "new",          //new, start, active, finish
        period: null,           //day, night
        voting: null,           //none, active, done
        voteState: [0, 0],      //[voted, total] of current voting
        citizenState: [0, 0],   //[alive, total] of citizens
        mafiaState: [0, 0],     //[alive, total] of mafia
        total: [0, 0],          //[alive, total] in total
        leader: null,           //leader
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

    static eventSource = null;

    static avatarURL(user) {
        return this.AVATAR_URL + '?user_id=' + user._id
    }
    static nameInitials(user) {
        var parts = user.displayName.toUpperCase().split(' ')
        return parts[0][0] + (parts.length > 1 ? parts[1][0] : '')
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
            default:
                return 'Game "' + game.name + '" status has changed to ' + change.status;
        }
    }
    static fetch(url, options, okHandler, errorHandler) {
        fetch(url, options)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then(resJson => {
            if (!resJson.success) {
                errorHandler(resJson.message)
            }
            else {
                okHandler(resJson.data)
            }
        })
        .catch(error => {
            errorHandler(error.message || error.statusText)
        })
    }
}
