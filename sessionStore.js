class SessionStore {
    constructor() {
        this.sessions = new Map();
    }

    createSession(sessionId) {
        this.sessions.set(sessionId, {
            sessionId,
            transcript: "",
            lastChunkId: 0,
            status: "connected"
        });
    }

    updateSession(sessionId, data) {
        const session = this.sessions.get(sessionId);

        if (!session) return;

        this.sessions.set(sessionId, {
            ...session,
            ...data
        });
    }

    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }

    deleteSession(sessionId) {
        this.sessions.delete(sessionId);
    }
}

module.exports = SessionStore;