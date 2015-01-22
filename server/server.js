Meteor.methods({
	clearInstaData: function() {
		InstaUpdates.remove({});
		Imgs.remove({});
		return "Cleared"
	},

	getNewImgs: function(token) {
		var imgs = Meteor.http.call('GET', 'https://api.instagram.com/v1/tags/chalmershero/media/recent?access_token='+token)
		if(imgs) {
			Imgs.insert({
				createdAt: new Date(),
				img: imgs.data.data[0]
			})
			return true
		}
		else {
			return false
		}		
	}
})

Router.onBeforeAction(Iron.Router.bodyParser.json({limit: "50mb"}), {where: 'server'})

Router.route('/subscription', {where: 'server',}).get(function() {
	this.response.end(this.request.query["hub.challenge"])
}).post(function() {
	var body = this.request.body
	InstaUpdates.insert({"body": body})
	this.response.end("Hi")
})