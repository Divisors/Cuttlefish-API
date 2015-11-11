class Cuttlefish {
	class Model {
		constructor(options) {
			this.name = options.name;
		}
		refresh
	},
	class ResourceManager {
		static getInstance() {
			return new Promise((yay, nay) => {
			
			});
		},
		class WebSocketResourceManager {
			constructor(uri) {
				this.uri = uri;
			},
			start() {
				return new Promise((yay, nay) => {
					this.websocket = new WebSocket(this.uri);
					this.websocket.onopen = () => {
					};	
					this.websocket.onclose = this.wsclose;
					this.websocket.onmessage = this.wsmessage;
					this.websocket.onerror = this.wserror;
				});
			}
		}
	}
}
