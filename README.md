Overview

This project implements a WebSocket-based Connection Recovery System in Node.js for managing client sessions, buffering incoming audio chunks, and supporting session recovery after disconnection.

The system is designed to:

track active client connections
manage per-session state
store incoming audio chunks
retry failed reconnections
recover pending chunks after reconnect
preserve session progress during temporary network interruptions

Connection State Management
	Implemented in: connectionManager.js
	This module tracks active session states using: this.connections = new Map();
	Each session stores a sessionId with its connection state.
	Example: abc123 -> connected
		   abc123 -> disconnected
	Methods: 
o	setState(sessionId, state) 
o	getState(sessionId) 
o	remove(sessionId)
Retry Handling
	Implemented in: retryHandler.js
	This module handles automatic retry attempts after disconnect.
	Responsibilities:
•	retry count 
•	retry delay 
•	max retry limit 
•	reset after successful reconnect 
This prevents immediate failure when temporary network interruptions occur.
Chunk Queue Buffering
		Implemented in: chunkQueue.js
		Audio chunks that cannot be sent during disconnect are stored temporarily in queue.
		Example: 
•	Chunk1 -> sent
•	Chunk2 -> sent
•	Chunk3 -> queued
•	Chunk4 -> queued
After reconnect:
Chunk3 & chunk4 -> resent
		This avoids audio data loss.
Session Recovery Service
		Implemented in: recoveryService.js
		This acts as the main controller for recovery.
Main functions:
initializeSession(sessionId) : Creates retry handler and chunk queue.
addChunk(sessionId, chunk): Adds unsent chunk to queue.
acknowledgeChunk(sessionId, chunkId): Removes successfully delivered chunk.
handleReconnect(sessionId, ws): Restores session after reconnect and replays pending chunks.
retryConnection(connectFn, sessionId): Attempts automatic reconnection using retry handler.

Workflow:
<img width="940" height="580" alt="image" src="https://github.com/user-attachments/assets/1f613bab-4d07-48c4-919e-4b91a78b7fd8" />

7.	Results and Outcome:
The Connection Recovery System is successfully implemented.
Results:
•	connection interruptions are handled automatically 
•	retry logic works as expected 
•	pending audio chunks are preserved during disconnect 
•	session state is restored after reconnect 
•	live streaming can resume without restarting session
