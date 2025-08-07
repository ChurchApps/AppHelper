import { ConnectionInterface, SocketActionHandlerInterface, SocketPayloadInterface, ApiHelper, ArrayHelper, CommonEnvironmentHelper } from "@churchapps/helpers";

export class SocketHelper {
  static socket: WebSocket;
  static socketId: string;
  static actionHandlers: SocketActionHandlerInterface[] = [];
  private static personIdChurchId: {personId:string, churchId:string} = {personId:"", churchId:""};
  private static isCleanedUp: boolean = false;

  static setPersonChurch = (pc: {personId:string, churchId:string}) => {
    if (pc?.personId && pc.personId && pc.churchId!==this.personIdChurchId.churchId && pc.personId!==this.personIdChurchId.personId) {
      this.personIdChurchId = pc;
      this.createAlertConnection();
    }
  }

  static createAlertConnection = () => {
    if (SocketHelper.personIdChurchId.personId && SocketHelper.socketId) {
      const connection: ConnectionInterface = { conversationId: "alerts", churchId: SocketHelper.personIdChurchId.churchId, displayName: "Test", socketId: SocketHelper.socketId, personId:SocketHelper.personIdChurchId.personId }
      
      ApiHelper.postAnonymous("/connections", [connection], "MessagingApi").catch((error: any) => {
        console.error("❌ Failed to create alert connection:", error);
      });
    }
  }

  static init = async () => {
    SocketHelper.cleanup();
    SocketHelper.isCleanedUp = false;
    
    if (SocketHelper.socket && SocketHelper.socket.readyState !== SocketHelper.socket.CLOSED) {
      try { 
        SocketHelper.socket.close(); 
      } catch (e) { 
        console.error("❌ Error closing existing socket:", e); 
      }
    }

    await new Promise((resolve, reject) => {
      try {
        SocketHelper.socket = new WebSocket(CommonEnvironmentHelper.MessagingApiSocket);
        
        SocketHelper.socket.onmessage = (event) => {
          if (SocketHelper.isCleanedUp) return;
          
          try {
            const payload = JSON.parse(event.data);
            SocketHelper.handleMessage(payload);
          } catch (error) {
            console.error("❌ Error parsing socket message:", error);
          }
        };
        
        SocketHelper.socket.onopen = async (e) => {
          SocketHelper.socket.send("getId");  // Request socket ID
          setTimeout(() => { resolve(null); }, 500);
        };
        
        SocketHelper.socket.onclose = async (e) => {
          console.log("🔌 WebSocket connection closed");
          // No retry logic - just log the closure
        };
        
        SocketHelper.socket.onerror = (error) => {
          console.error("❌ WebSocket connection error:", error);
          reject(error);
        };
        
      } catch (error) {
        console.error("❌ Error initializing socket:", error);
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
      if (payload.action==="socketId") {
        SocketHelper.socketId = payload.data;
        SocketHelper.createAlertConnection();
      }
      else {
        const matchingHandlers = ArrayHelper.getAll(SocketHelper.actionHandlers, "action", payload.action);
        matchingHandlers.forEach((handler) => {
          try {
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
    SocketHelper.personIdChurchId = {personId:"", churchId:""};
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
