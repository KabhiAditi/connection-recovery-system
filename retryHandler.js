class RetryHandler {
    constructor(maxRetries = 5) {
        this.maxRetries = maxRetries;
        this.retryCount = 0;
    }

    canRetry() {
        return this.retryCount < this.maxRetries;
    }

    getDelay() {
        return Math.min(1000 * 2 ** this.retryCount, 10000);
    }

    increment() {
        this.retryCount++;
    }

    reset() {
        this.retryCount = 0;
    }
}

module.exports = RetryHandler;