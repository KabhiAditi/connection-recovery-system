const RetryHandler = require("./retryHandler");
const ChunkQueue = require("./chunkQueue");

class RecoveryService {
    constructor() {
        this.retryHandlers = new Map();
        this.chunkQueues = new Map();
    }

    initializeSession(sessionId) {
        this.retryHandlers.set(
            sessionId,
            new RetryHandler()
        );

        this.chunkQueues.set(
            sessionId,
            new ChunkQueue()
        );
    }

    addChunk(sessionId, chunk) {
        const queue = this.chunkQueues.get(sessionId);

        if (queue) {
            queue.addChunk(chunk);
        }
    }

    acknowledgeChunk(sessionId, chunkId) {
        const queue = this.chunkQueues.get(sessionId);

        if (queue) {
            queue.removeChunk(chunkId);
        }
    }

    handleReconnect(sessionId, ws) {
        const retryHandler =
            this.retryHandlers.get(sessionId);

        if (!retryHandler) return;

        retryHandler.reset();

        const queue =
            this.chunkQueues.get(sessionId);

        if (!queue) return;

        const pendingChunks =
            queue.getPendingChunks();

        pendingChunks.forEach(chunk => {
            ws.send(JSON.stringify(chunk));
        });

        console.log(
            `Recovered session ${sessionId}`
        );
    }

    async retryConnection(connectFn, sessionId) {
        const retryHandler =
            this.retryHandlers.get(sessionId);

        if (!retryHandler) return;

        while (retryHandler.canRetry()) {

            const delay = retryHandler.getDelay();

            console.log(
                `Retrying in ${delay}ms`
            );

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );

            try {
                await connectFn();

                retryHandler.reset();

                console.log(
                    "Reconnection successful"
                );

                return true;

            } catch (err) {

                retryHandler.increment();

                console.log(
                    "Reconnect failed"
                );
            }
        }

        console.log(
            "Max retries reached"
        );

        return false;
    }
}

module.exports = RecoveryService;