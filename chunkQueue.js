class ChunkQueue {
    constructor() {
        this.queue = [];
    }

    addChunk(chunk) {
        this.queue.push(chunk);
    }

    removeChunk(chunkId) {
        this.queue = this.queue.filter(
            chunk => chunk.chunkId !== chunkId
        );
    }

    getPendingChunks() {
        return this.queue;
    }

    clear() {
        this.queue = [];
    }
}

module.exports = ChunkQueue;