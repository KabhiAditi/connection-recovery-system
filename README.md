# WebSocket Connection Recovery System

## Overview

This project implements a **WebSocket-based Connection Recovery System** in **Node.js** for managing client sessions, buffering incoming audio chunks, and supporting session recovery after disconnection.

The system is designed to:

- Track active client connections
- Manage per-session state
- Store incoming audio chunks
- Retry failed reconnections
- Recover pending chunks after reconnect
- Preserve session progress during temporary network interruptions

---

# Project Structure

```bash
├── connectionManager.js
├── retryHandler.js
├── chunkQueue.js
├── recoveryService.js
└── README.md
```

---

# Features

## 1. Connection State Management

**Implemented in:** `connectionManager.js`

This module tracks active session states using:

```js
this.connections = new Map();
```

Each session stores a `sessionId` with its connection state.

### Example

```text
abc123 -> connected
abc123 -> disconnected
```

### Methods

#### `setState(sessionId, state)`
Sets the current state of a session.

#### `getState(sessionId)`
Returns the current state of a session.

#### `remove(sessionId)`
Removes a session from tracking.

---

## 2. Retry Handling

**Implemented in:** `retryHandler.js`

This module handles **automatic retry attempts** after a disconnect.

### Responsibilities

- Maintain retry count
- Apply retry delay
- Enforce maximum retry limit
- Reset retry state after successful reconnect

This prevents immediate failure during temporary network interruptions.

---

## 3. Chunk Queue Buffering

**Implemented in:** `chunkQueue.js`

Audio chunks that cannot be sent during disconnection are temporarily stored in a queue.

### Example

```text
Chunk1 -> sent
Chunk2 -> sent
Chunk3 -> queued
Chunk4 -> queued
```

After reconnect:

```text
Chunk3 -> resent
Chunk4 -> resent
```

This ensures **no audio data is lost** during connection interruptions.

---

## 4. Session Recovery Service

**Implemented in:** `recoveryService.js`

This is the **main controller** responsible for recovery.

### Main Functions

### `initializeSession(sessionId)`
Creates a retry handler and chunk queue for the session.

### `addChunk(sessionId, chunk)`
Adds unsent chunk to the queue.

### `acknowledgeChunk(sessionId, chunkId)`
Removes successfully delivered chunk from queue.

### `handleReconnect(sessionId, ws)`
Restores session after reconnect and replays pending chunks.

### `retryConnection(connectFn, sessionId)`
Attempts automatic reconnection using retry handler.

---

# Workflow

## Connection Recovery Flow

1. Client connects via WebSocket
2. Session is initialized
3. Audio chunks are streamed
4. If connection drops:
   - session marked disconnected
   - retry mechanism starts
   - unsent chunks are queued
5. On reconnect:
   - session is restored
   - queued chunks are replayed
6. Streaming resumes without restarting the session

---

## Architecture / Workflow Diagram

Add your workflow image here:
<img width="940" height="580" alt="image" src="https://github.com/user-attachments/assets/d4c67ab4-f9c8-44e2-a878-ac60eceb1743" />


```md
![Workflow Diagram](https://github.com/user-attachments/assets/1f613bab-4d07-48c4-919e-4b91a78b7fd8)
```

---

# Results and Outcome

The **Connection Recovery System** was successfully implemented.

## Results

- Connection interruptions are handled automatically
- Retry logic works as expected
- Pending audio chunks are preserved during disconnect
- Session state is restored after reconnect
- Live streaming resumes without restarting the session

---

# Conclusion

This project demonstrates a reliable **WebSocket recovery mechanism** for real-time streaming systems.

By combining:

- Session state management
- Retry handling
- Chunk buffering
- Session recovery

the system ensures seamless recovery from temporary network failures while preventing data loss and preserving user session continuity.

---
