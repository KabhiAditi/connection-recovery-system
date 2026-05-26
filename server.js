const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const ConnectionManager =
    require("./connectionManager");

const SessionStore =
    require("./sessionStore");

const RecoveryService =
    require("./recoveryService");

const wss = new WebSocket.Server({
    port: 8080
});

const connectionManager =
    new ConnectionManager();

const sessionStore =
    new SessionStore();

const recoveryService =
    new RecoveryService();

console.log(
    "Recovery WebSocket Server Running..."
);

wss.on("connection", (ws) => {

    const sessionId = uuidv4();

    console.log(
        `Client connected: ${sessionId}`
    );

    sessionStore.createSession(sessionId);

    connectionManager.setState(
        sessionId,
        "connected"
    );

    recoveryService.initializeSession(
        sessionId
    );

    ws.send(JSON.stringify({
        type: "SESSION_CREATED",
        sessionId
    }));

    ws.on("message", (message) => {

        const data = JSON.parse(message);

        if (data.type === "AUDIO_CHUNK") {

            recoveryService.addChunk(
                sessionId,
                data
            );

            console.log(
                `Chunk received: ${data.chunkId}`
            );

            recoveryService.acknowledgeChunk(
                sessionId,
                data.chunkId
            );

            sessionStore.updateSession(
                sessionId,
                {
                    lastChunkId: data.chunkId
                }
            );
        }
    });

    ws.on("close", () => {

        console.log(
            `Disconnected: ${sessionId}`
        );

        connectionManager.setState(
            sessionId,
            "disconnected"
        );
    });

    ws.on("error", (err) => {

        console.log(
            `Error: ${err.message}`
        );
    });
});