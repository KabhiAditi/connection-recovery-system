class ConnectionManager {
    constructor() {
        this.connections = new Map();
    }

    setState(sessionId, state) {
        this.connections.set(sessionId, state);
    }

    getState(sessionId) {
        return this.connections.get(sessionId);
    }

    remove(sessionId) {
        this.connections.delete(sessionId);
    }
}


module.exports = ConnectionManager;