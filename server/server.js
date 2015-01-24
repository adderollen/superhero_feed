var TAG = 'chalmershero'

var apiURLForTag = function(tag) {
	return 'https://api.instagram.com/v1/tags/'+tag+'/media/recent'
}

Meteor.startup(function() {
	if(Tags.find().count() === 0) {
		Tags.insert({name: TAG})
	}
})

Meteor.methods({

	trackNewTag: function(tag) {
		check(tag, String)
		Tags.remove({})
		return Tags.insert({ name: tag })
	},

	clearInstaData: function() {
		InstaUpdates.remove({});
		Imgs.remove({});
		return "Cleared"
	},

	getNewImgs: function(token) {
		check(token, String)
		this.unblock()

		try {
			var tag = Tags.findOne(),
					imgs = Meteor.http.get(apiURLForTag(tag), {
						params: { access_token: token }
					})

			if(imgs && imgs.data.data.length > 0) {
				return Imgs.insert({
					createdAt: new Date(),
					img: imgs.data.data[0]
				})
			}
			else {
				return false
			}
		}
		catch(e) {
			throw new Meteor.Error(403, e)
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
