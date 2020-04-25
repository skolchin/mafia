
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
}

export const backend = new Backend();
