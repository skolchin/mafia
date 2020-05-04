const emptyGame = {
    game_id: null,
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

const emptyUser = {
    user_id: null,
    login: null,
    token: null,
    name: null,
};

const emptyGameList = {
    games: [],
};

const initialAppState = {
    user: emptyUser,
    games: emptyGameList,
    profileOpening: false,
}

export default class Backend {
    static lastGameId = 0;

    static initialState() {
        return initialAppState;
    }

    static emptyUser() {
        return emptyUser;
    }
    static checkUserExists(login) {
        return fetch('http://localhost:5000/users?login=' + login.toLowerCase())
    }
    static loginUser(values) {
        return fetch('http://localhost:5000/auth',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "login",
                login: values.login,
                password: values.password
            })
          })
    }
    static restoreSession(token) {
        return fetch('http://localhost:5000/auth',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "restore",
                token: token
            })
          })
    }
    static logoutUser(values) {
        return fetch('http://localhost:5000/auth',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "logout",
                user_id: values.user_id,
                token: values.token
            })
          })
    }
    static avatarURL(values) {
        return 'http://localhost:5000/a?user_id=' + values.user_id.toString()
    }
    static nameInitials(values) {
        var parts = values.name.toUpperCase().split(' ')
        return parts[0][0] + (parts.length > 1 ? parts[1][0] : '')
    }

    static emptyGame() {
        return emptyGame;
    }
    static emptyGameList() {
        return emptyGameList;
    }
    static newGame(values) {
        return fetch('http://localhost:5000/g',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "new",
                user_id: values.user_id,
                name: '<New game>'
            })
          })
    }
    static updateGame(values) {
        return fetch('http://localhost:5000/g',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "update",
                game_id: values.game_id,
                state: JSON.stringify(values),
            })
          })
    }
    static nextGameState(values) {
        return fetch('http://localhost:5000/g',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "next_state",
                game_id: values.game_id,
            })
          })
    }
    static stopGame(values) {
        return fetch('http://localhost:5000/g',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "stop",
                game_id: values.game_id,
            })
          })
    }
    static joinGame(values) {
        console.log(values);
        return fetch('http://localhost:5000/g',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "join",
                game_id: values.game_id,
                user_id: values.user_id,
                role: values.role,
            })
          })
    }

    static checkInGame(game, user) {
        let _login = user.login.toLowerCase();
        return game.members.some(item => item.login.toLowerCase() === _login);
    }
    static leaveGame(game, user) {
        return true;        
    }
}
