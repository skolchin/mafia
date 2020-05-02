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
    total: 1,               //members total
    leader: null,           //leader
    members: []
}

const emptyUser = {
    user_id: null,
    login: null,
    token: null,
    name: null,
    profileOpening: false,
};

const emptyGameList = {
    games: [],
    error: null,
};


export default class Backend {
    static lastGameId = 0;

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
              login: values.login,
              password: values.password
            })
          })
    }
    static avatarURL(values) {
        return 'http://localhost:5000/ua?user_id=' + values.user_id.toString()
    }
    static nameInitials(values) {
        var parts = values.name.toUpperCase().split(' ')
        return parts[0][0] + (parts.length > 1 ? parts[1][0] : '')
    }
    static logoutUser(login) {
        return true;
    }

    static emptyGame() {
        return emptyGame;
    }
    static emptyGameList() {
        return emptyGameList;
    }
    static newGame(user) {
        let id = this.lastGameId;
        this.lastGameId += 1;
        return {
            ...emptyGame,
            id: id,
            name: "Game #" + this.lastGameId.toString(),
            status: "new",
            started: new Date(),
            leader: user,
            total: 1,
            members: [{...user, role: 'leader'}]
        }
    }
    static checkInGame(game, user) {
        let _login = user.login.toLowerCase();
        return game.members.some(item => item.login.toLowerCase() === _login);
    }
    static joinGame(game, user, role_ = null) {
        if (this.checkInGame(game, user)) 
            throw new Error(user.login + " already registered to game " + game.name);
        return {
            ...game,
            total: game.total + 1,
            members: [...game.members, {...user, role: role_}]
        }
    }
    static leaveGame(game, user) {
        return true;        
    }
    static assignRoles(game) {
        if (!game.members || game.members.length < 4)
            throw new Error("Minimum 4 members required to start a game");
        let mafiaTotal = (game.members.length - 1) // 3;
        if (mafiaTotal < 1) mafiaTotal = 1;

        let mafiaCount = 0;
        game.members.forEach(item => {
            if (item.role !== 'leader') {
                let r = Math.round(Math.random());
                item.role = (r == 0 && mafiaCount < mafiaTotal ? "mafia" : "citizen");
                if (item.role == "mafia") mafiaCount += 1;
            }
        });
        return game.members;
    }
}
