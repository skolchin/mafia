export const initialGameState = {
    id: null,
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

export const initialAuthState = {
    login: null,
    token: null,
    name: null,
    avatar: null,
    profileOpening: false,
};

class Backend {
    constructor() {
        this.users = [
            {
                id: 0,
                login: '1',
                name: 'Sergey Kolchin',
                avatar: 'avatar1.jpg',
                token: 'a'
            },
            {
                id: 1,
                login: '2',
                name: 'Kolchin Sergey',
                avatar: 'avatar2.jpg',
                token: 'a'
            },
            {
                id: 2,
                login: '3',
                name: 'Don Corleone',
                avatar: 'avatar3.jpg',
                token: 'b'
            },
            {
                id: 3,
                login: '4',
                name: 'Utagawa',
                avatar: 'avatar4.jpg',
                token: 'b'
            },
        ]
        this.lastGameId = 0;
    }
    checkUserExists(login) {
        let _login = login.toLowerCase();
        return this.users.some(item => item.login.toLowerCase() === _login);
    }
    findUser(login) {
        let _login = login.toLowerCase();
        return this.users.find(item => item.login.toLowerCase() === _login);
    }
    loginUser(values) {
        return this.findUser(values.login);
    }
    logoutUser(login) {
        return true;
    }

    newGame(user) {
        let id = this.lastGameId;
        this.lastGameId += 1;
        return {
            ...initialGameState,
            id: id,
            name: "Game #" + this.lastGameId.toString(),
            status: "new",
            started: new Date(),
            leader: user,
            total: 1,
            members: [{...user, role: 'leader'}]
        }
    }
    checkInGame(game, user) {
        let _login = user.login.toLowerCase();
        return game.members.some(item => item.login.toLowerCase() === _login);
    }
    joinGame(game, user, role_ = null) {
        if (this.checkInGame(game, user)) 
            throw new Error(user.login + " already registered to game " + game.name);
        return {
            ...game,
            total: game.total + 1,
            members: [...game.members, {...user, role: role_}]
        }
    }
    leaveGame(game, user) {
        return true;        
    }
    assignRoles(game) {
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

export const backend = new Backend();
