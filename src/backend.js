export const initialGameState = {
    id: null,
    name: null,
    started: null,
    round: 1,
    status: "new",          //new, start, active, finish
    period: "day",          //day, night
    voting: "none",         //none, active, done
    voteState: [0, 0],      //[voted, total] of current voting
    citizenState: [0, 0],   //[alive, total] of citizens
    mafiaState: [0, 0],     //[alive, total] of mafia
    total: 1,               //members total
    leaderId: null,         //ID of leader
    leaderName: null,       //leader name
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
    }
}

export const backend = new Backend();
