window.Cuttlefish = (function() {
	class Model {
		constructor(options) {
			this.name = options.name;
		}
		refresh() {
			return new Promise(((yay, nay)=> {
				ResourceManager.getInstance().getResource({
					name: this.name,
					type: 'json', 
					lfc: false,
					clfc: true,
					stc: true});
				}).then(this.update, (error,ea1)=>(nay(this, error, ea1))));
			}).bind(this));
		},
		update(data) {
			for (var i in data)
				this[i] = data[i];
		}
	}
	class ResourceManager {
		static getInstance() {
			if(ResourceManager.inst === undefined)
				ResourceManager.inst = new ResourceManager();
			return ResourceManager.inst;
		},
		constructor() {
			this.activeRequests = [];
			this.defaultLoader = new WebSocketResourceLoader('/resource/ws');
			this.defaultLoader.start().then((yay)=>{},(err)=>{
				this.defaultLoader = new XHRResourceLoader('/resource/xhr');
			});
		},
		getCachedObject(name, l) {
			if ((!l) || l < 0)
				return undefined;
			var txt = window.localStorage[name];
			if (!txt)
				return undefined;
			var obj = JSON.parse(txt);
			if (l !== true && obj.l < l)
				return undefined;
			return obj.d;
		},
		putCachedObject(name, data) {
			window.localStorage[name] = JSON.stringify({l:Date.now(),n:name,d:data});
		},
		getResource(options) {
			var name = options.name;
			var hasStorage = (typeof(Storage) !== "undefined");
			var lfcache = hasStorage ? (options.lfc || 0) : false;
			var clfcache = (options.clfc || true) && hasStorage;
			var stcache = (options.stc || true) && hasStorage;
			var type = options.type || 'data';
			if (lfcache || ((!navigator.onLine) && clfcache)) {
				var cached = this.getCachedObject(name, lfcache);
				if (cached !== undefined)
					return new Promise((yay, nay) => (yay(this.formatResult(type, cached), this)));
			}
			if ('onLine' in navigator && (!navigator.onLine))
				return Promise.reject('Offline');
			return new Promise((yay, nay) => {
				
			});
		},
		formatResult(type, data) {
			if (type === undefined || type=='raw')
				return data;
			if (type == 'json')
				return JSON.parse(data);
			if (type == 'view')
				return undefined;//TODO finish
		},
		getScript(options) {
			
		},
		_jsonpCallback(data) {
			
		}
	}
	class WebSocketResourceLoader {
		constructor(uri) {
			this.uri = uri;
		},
		start() {
			var self = this;
			return new Promise((yay, nay) => {
				self.websocket = new WebSocket(self.uri);
				self.websocket.onerror = (evt) => {
					console.error(evt, this);
					nay(this,evt);
				}
				self.websocket.onopen = (evt) => {
					self.isopen = true;
					self.websocket.onerror = self.wserror;
					yay(this);
				};
				self.websocket.onclose = self.wsclose;
				self.websocket.onmessage = self.wsmessage;
			});
		},
		wsclose(evt) {
			this.isopen = false;
			this.websocket = undefined;
			console.info('ws closed');
		},
		wsmessage(evt) {
			console.log('RECIEVED ',evt.data);
		},
		close() {
			this.websocket.close();
		},
		send(message) {
			console.log('SENT ',message);
			this.websocket.send(message);
		},
		wserror(evt) {
			console.error(evt);
		},
		open() {
			return this.isopen;
		}
	}
	return {
		Model: Model,
		View: View,
		ResourceManager: ResourceManager
	};
})();
