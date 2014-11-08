var WS = function(wsUri){
	var self = {};

	self.ws = new WebSocket(wsUri);

	self.opened = jQuery.Deferred();

	self.onMessage = null;

	self.ws.onopen = function(evt) { 
		self.opened.resolve();
	}; 
	self.ws.onclose = function(evt) { 
		console.log("closed",evt);
	}; 
	self.ws.onmessage = function(evt) { 
		if (typeof(self.onMessage)==='function'){
			self.onMessage(JSON.parse(evt.data));
		}
	}; 
	self.ws.onerror = function(evt) { 
		console.log("error",evt);
	};

	self.send = function(type, msg){
		var obj = {
			msgType: type,
			data: msg
		};
		try{
			var str = JSON.stringify(obj);
			console.log("sending:"+str);
			self.ws.send(str);
		}
		catch(ex){
			console.log(ex);
		}
	};

	return self;
};