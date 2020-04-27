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
    members: [],
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
                login: 'a',
                name: 'Sergey Kolchin',
                avatar: 'avatar1.jpg',
                token: 'a'
            }
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
            members: [user]
        }
    }
}

export const backend = new Backend();
