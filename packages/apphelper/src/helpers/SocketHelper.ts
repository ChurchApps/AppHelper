import { ConnectionInterface, SocketActionHandlerInterface, SocketPayloadInterface, ApiHelper, ArrayHelper, CommonEnvironmentHelper } from "@churchapps/helpers";

export class SocketHelper {
	static socket: WebSocket;
	static socketId: string;
	static actionHandlers: SocketActionHandlerInterface[] = [];
	private static personIdChurchId: { personId: string, churchId: string } = { personId: "", churchId: "" };
	private static isCleanedUp: boolean = false;

	static setPersonChurch = (pc: { personId: string, churchId: string }) => {
		console.log('👤 SocketHelper: Setting person/church context:', pc);

		if (pc?.personId && pc.personId && pc.churchId !== this.personIdChurchId.churchId && pc.personId !== this.personIdChurchId.personId) {
			this.personIdChurchId = pc;
			console.log('🔗 SocketHelper: Person/church context updated, creating alert connection');
			this.createAlertConnection();
		} else {
			console.log('⚠️ SocketHelper: Person/church context unchanged or invalid');
		}
	}

	static createAlertConnection = () => {
		console.log('🔗 SocketHelper: Attempting to create alert connection...');
		console.log('🆔 Socket ID:', SocketHelper.socketId);
		console.log('👤 Person ID:', SocketHelper.personIdChurchId.personId);
		console.log('⛪ Church ID:', SocketHelper.personIdChurchId.churchId);

		if (SocketHelper.personIdChurchId.personId && SocketHelper.socketId) {
			const connection: ConnectionInterface = {
				conversationId: "alerts",
				churchId: SocketHelper.personIdChurchId.churchId,
				displayName: "Test",
				socketId: SocketHelper.socketId,
				personId: SocketHelper.personIdChurchId.personId
			}

			console.log('🔗 SocketHelper: Creating alert connection with data:', connection);

			ApiHelper.postAnonymous("/connections", [connection], "MessagingApi").then((response: any) => {
				console.log('✅ SocketHelper: Alert connection created successfully:', response);
			}).catch((error: any) => {
				console.error("❌ Failed to create alert connection:", error);
				console.error("❌ Error details:", {
					status: error.status,
					message: error.message,
					response: error.response
				});
			});
		} else {
			console.warn('⚠️ SocketHelper: Cannot create alert connection - missing data:', {
				hasPersonId: !!SocketHelper.personIdChurchId.personId,
				hasSocketId: !!SocketHelper.socketId,
				personId: SocketHelper.personIdChurchId.personId,
				socketId: SocketHelper.socketId
			});
		}
	}

	static init = async () => {
		console.log('🔌 SocketHelper: Starting initialization...');
		SocketHelper.cleanup();
		SocketHelper.isCleanedUp = false;

		if (SocketHelper.socket && SocketHelper.socket.readyState !== SocketHelper.socket.CLOSED) {
			console.log('🔌 SocketHelper: Closing existing socket connection');
			try {
				SocketHelper.socket.close();
			} catch (e) {
				console.error("❌ Error closing existing socket:", e);
			}
		}

		console.log('🔌 SocketHelper: Connecting to:', CommonEnvironmentHelper.MessagingApiSocket);

		await new Promise((resolve, reject) => {
			let hasReceivedSocketId = false;
			let messageCount = 0;

			try {
				SocketHelper.socket = new WebSocket(CommonEnvironmentHelper.MessagingApiSocket);

				SocketHelper.socket.onmessage = (event) => {
					console.log("🔔 SocketHelper: onmessage event triggered");
					if (SocketHelper.isCleanedUp) return;

					messageCount++;
					console.log(`📨 SocketHelper: Raw message #${messageCount} received:`, event.data);
					console.log(`📨 SocketHelper: Message timestamp:`, new Date().toISOString());
					console.log(`📨 SocketHelper: Message size:`, event.data.length, 'characters');

					try {
						const payload = JSON.parse(event.data);
						console.log(`📨 SocketHelper: Parsed message #${messageCount}:`, payload);
						console.log(`📨 SocketHelper: Message action:`, payload.action);
						console.log(`📨 SocketHelper: Message data type:`, typeof payload.data);

						if (payload.action === 'socketId') {
							hasReceivedSocketId = true;
							console.log('🆔 SocketHelper: Socket ID received!', payload.data);
						}

						// Log all message types we receive
						switch (payload.action) {
							case 'socketId':
								console.log('🆔 Message type: Socket ID assignment');
								break;
							case 'privateMessage':
								console.log('💬 Message type: Private message notification');
								break;
							case 'notification':
								console.log('🔔 Message type: General notification');
								break;
							case 'message':
								console.log('📩 Message type: Message update');
								break;
							case 'reconnect':
								console.log('🔄 Message type: Reconnection signal');
								break;
							default:
								console.log('❓ Message type: Unknown action -', payload.action);
						}

						SocketHelper.handleMessage(payload);
					} catch (error) {
						console.error("❌ Error parsing socket message:", error);
						console.error("❌ Raw message was:", event.data);
					}
				};

				SocketHelper.socket.onopen = async (e) => {
					console.log('✅ SocketHelper: WebSocket connection opened');
					console.log('🔌 SocketHelper: Connection URL:', SocketHelper.socket.url);
					console.log('🔌 SocketHelper: Connection protocol:', SocketHelper.socket.protocol);

					// Send the getId request
					console.log('🔌 SocketHelper: Sending getId request...');
					SocketHelper.socket.send("getId");
					console.log('🔌 SocketHelper: getId request sent');

					// Wait longer to see if we get a response
					setTimeout(() => {
						if (!hasReceivedSocketId) {
							console.warn('⚠️ SocketHelper: No socket ID received after 3 seconds');
							console.log('🔍 SocketHelper: Socket state:', SocketHelper.socket.readyState);
							console.log('🔍 SocketHelper: Messages received so far:', messageCount);
						}
						resolve(null);
					}, 3000);
				};

				SocketHelper.socket.onclose = async (e) => {
					console.log('🔒 SocketHelper: WebSocket connection closed', {
						code: e.code,
						reason: e.reason,
						wasClean: e.wasClean,
						timestamp: new Date().toISOString(),
						totalMessagesReceived: messageCount
					});

					// Log common close codes for debugging
					if (e.code === 1005) console.log('🔍 Close code 1005: No status received (normal for some servers)');
					else if (e.code === 1006) console.log('🔍 Close code 1006: Abnormal closure');
					else if (e.code === 1000) console.log('🔍 Close code 1000: Normal closure');
					else console.log('🔍 Close code:', e.code);
				};

				SocketHelper.socket.onerror = (error) => {
					console.error('❌ SocketHelper: WebSocket connection error:', error);
					console.error('❌ SocketHelper: Messages received before error:', messageCount);
					reject(error);
				};

			} catch (error) {
				console.error('❌ SocketHelper: Error initializing socket:', error);
				reject(error);
			}
		});
	}

	static addHandler = (action: string, id: string, handleMessage: (data: any) => void) => {
		const existing = ArrayHelper.getOne(SocketHelper.actionHandlers, "id", id);
		if (existing !== null) {
			existing.handleMessage = handleMessage;
		} else {
			SocketHelper.actionHandlers.push({ action, id, handleMessage });
		}
	}

	static removeHandler = (id: string) => {
		SocketHelper.actionHandlers = SocketHelper.actionHandlers.filter(handler => handler.id !== id);
	}

	static removeHandlersByAction = (action: string) => {
		SocketHelper.actionHandlers = SocketHelper.actionHandlers.filter(handler => handler.action !== action);
	}

	static clearAllHandlers = () => {
		SocketHelper.actionHandlers = [];
	}

	static handleMessage = (payload: SocketPayloadInterface) => {
		if (SocketHelper.isCleanedUp) return;

		try {
			console.log('🔄 SocketHelper: Processing message with action:', payload.action);

			if (payload.action === "socketId") {
				console.log('🆔 SocketHelper: Received socket ID:', payload.data);
				SocketHelper.socketId = payload.data;
				SocketHelper.createAlertConnection();
			}
			else {
				const matchingHandlers = ArrayHelper.getAll(SocketHelper.actionHandlers, "action", payload.action);
				console.log(`📬 SocketHelper: Found ${matchingHandlers.length} handlers for action: ${payload.action}`);

				matchingHandlers.forEach((handler) => {
					try {
						console.log(`🏃 SocketHelper: Executing handler ${handler.id} for action: ${payload.action}`);
						handler.handleMessage(payload.data);
					} catch (error) {
						console.error(`❌ Error in handler ${handler.id}:`, error);
					}
				});
			}
		} catch (error) {
			console.error("❌ Error handling socket message:", error);
		}
	}

	static cleanup = () => {
		SocketHelper.isCleanedUp = true;

		// Close socket connection
		if (SocketHelper.socket && SocketHelper.socket.readyState !== SocketHelper.socket.CLOSED) {
			try {
				SocketHelper.socket.close();
			} catch (error) {
				console.error("Error closing socket:", error);
			}
		}

		// Clear references
		SocketHelper.socket = null;
		SocketHelper.socketId = null;
		SocketHelper.actionHandlers = [];
		SocketHelper.personIdChurchId = { personId: "", churchId: "" };
	}

	static disconnect = () => {
		SocketHelper.cleanup();
	}

	static isConnected = (): boolean => {
		return SocketHelper.socket && SocketHelper.socket.readyState === SocketHelper.socket.OPEN;
	}

	static getConnectionState = (): string => {
		if (!SocketHelper.socket) return "UNINITIALIZED";

		switch (SocketHelper.socket.readyState) {
			case SocketHelper.socket.CONNECTING:
				return "CONNECTING";
			case SocketHelper.socket.OPEN:
				return "OPEN";
			case SocketHelper.socket.CLOSING:
				return "CLOSING";
			case SocketHelper.socket.CLOSED:
				return "CLOSED";
			default:
				return "UNKNOWN";
		}
	}

	// Global cleanup on window unload
	static setupGlobalCleanup = () => {
		if (typeof window !== "undefined") {
			const cleanup = () => {
				SocketHelper.cleanup();
			};

			window.addEventListener("beforeunload", cleanup);
			window.addEventListener("unload", cleanup);

			// Also cleanup on page visibility change (when tab is closed)
			document.addEventListener("visibilitychange", () => {
				if (document.visibilityState === "hidden") {
					// Optional: cleanup when tab becomes hidden
					// SocketHelper.cleanup();
				}
			});

			return cleanup;
		}
	}

}
