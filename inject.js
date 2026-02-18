(function () {
  const scene = cc.director.getScene();
  const findComp = (name) => scene.getComponentInChildren(name);

  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    if (typeof url === "string" && url.includes("discordsays.com")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(""),
      });
    }
    return originalFetch.apply(this, arguments);
  };

  const oldOpen = XMLHttpRequest.prototype.open;
  const oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (
      typeof url === "string" &&
      (url.includes("discordapp.com") || url.includes("avatars"))
    )
      this._isBlockedAvatar = true;
    return oldOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (data) {
    if (this._isBlockedAvatar) {
      const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      setTimeout(() => {
        const byteCharacters = atob(pngBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
        Object.defineProperty(this, "status", { value: 200 });
        Object.defineProperty(this, "readyState", { value: 4 });
        Object.defineProperty(this, "response", { value: blob });
        if (this.onload) this.onload();
      }, 10);
      return;
    }
    return oldSend.apply(this, arguments);
  };

  const OriginalWebSocket = window.WebSocket;
  class MockSocket {
    constructor(url) {
      console.log("[Mock] Socket Created");
      this.readyState = MockSocket.CONNECTING;
      this._lastState = {
        primary_user: "local-player",
        participants: [],
        properties: {
          round_state: 1,
          current_hole: 0,
          level: 0,
          level_seed: 12345,
          start_timer: -1,
          votes: {},
        },
      };

      setTimeout(() => {
        this.readyState = MockSocket.OPEN;
        this.onopen && this.onopen();
      }, 100);
    }

    send(data) {
      if (this.readyState !== MockSocket.OPEN) return;
      let msg;
      try {
        if (typeof data === 'string') {
            msg = JSON.parse(data);
        } else {
            const textDecoder = new TextDecoder();
            msg = JSON.parse(textDecoder.decode(data));
        }
      } catch (e) {
          console.warn("got binary data, hope this is JSON!!");
          return; 
      }

      switch (msg.opcode) {
        case 1:
          this._respond(2, { time: Date.now() });
          break;
        case 3:
          if (!this._lastState.participants.find(p => p.id === "local-player")) {
              this._lastState.participants.push({
                id: "local-player",
                state: { phase: 1, strokes: 0, score: [], hole: 0 },
              });
          }
          this._respond(35, { user: { id: "local-player", username: "PlayerOne", avatar_url: "default" } });
          this._respond(46, { game: { state: this._lastState } });
          break;
        case 11:
          if (msg.data && msg.data.state && msg.data.state.properties) {
            Object.assign(this._lastState.properties, msg.data.state.properties);
            this._respond(46, { game: { state: this._lastState } });
          }
          break;
        case 13:
          this._respond(47, { game_id: "mock-game", user_id: "local-player" });
          if (this._lastState) {
            if (!this._lastState.participants.find((p) => p.id === "local-player")) {
              this._lastState.participants.push({ id: "local-player", state: { phase: 1, strokes: 0, score: [], hole: 0 } });
            }
            this._respond(46, { game: { state: this._lastState } });
          }
          break;
        case 66:
            if(msg.data && msg.data.id && msg.data.state) {
                const p = this._lastState.participants.find(x => x.id === msg.data.id);
                if(p) {
                    p.state = msg.data.state;
                    this._respond(98, { id: msg.data.id, state: msg.data.state }); 
                }
            }
            break;
      }
    }

    _respond(opcode, data) {
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({ data: JSON.stringify({ opcode, data }) });
        }
      }, 10);
    }

    close() { this.readyState = MockSocket.CLOSED; }
  }
  Object.assign(MockSocket, OriginalWebSocket);
  window.WebSocket = MockSocket;

  const gm = findComp("GameManager");
  const net = gm._netGame;
  const connect = findComp("UIPanelConnectScreen");

  if (connect && connect.node) connect.node.active = false;
  if (gm.connectingText && gm.connectingText.node)
    gm.connectingText.node.active = false;

  net._client.connection.protocol = "Json";
  gm.userID = "local-player";
  gm._activityReady = true;
  net.primaryUser = true;

  const modeScreen = findComp("GameplayModeScreen");
  if (modeScreen) {
    modeScreen.node.active = true;
    modeScreen.node.setSiblingIndex(999);
  }

  net.connect(window.location.host, gm.appID, gm.guildID, gm.roomID, gm.userID);
  console.log(`ready, connected to ${window.location.host}`);
})();
