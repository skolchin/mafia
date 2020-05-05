export default class Backend {
    static HOST = 'http://localhost:5000';
    static AUTH_URL = this.HOST + '/auth';
    static AVATAR_URL = this.HOST + '/a';
    static GAMES_URL = this.HOST + '/g';
    static MESSAGES_URL = this.HOST + '/m';

    static INITIAL_USER_STATE = {
        user_id: null,
        login: null,
        token: null,
        name: null,
    }
    static INITIAL_GAME_STATE = {
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
    static INITIAL_MESSAGE_STATE = {
        user_id: null,
        game_id: null,
        type: null,
        data: null,
        sent: null,
    }
    
    static INITIAL_APP_STATE = {
        user: this.INITIAL_USER_STATE,
        games: [],
        messages: [],
        profileOpening: false,
    };

    static avatarURL(values) {
        return this.AVATAR_URL + '?user_id=' + values.user_id.toString()
    }
    static nameInitials(values) {
        var parts = values.name.toUpperCase().split(' ')
        return parts[0][0] + (parts.length > 1 ? parts[1][0] : '')
    }
}
