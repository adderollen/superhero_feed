Meteor.methods({
	getImages: function (tag, token) {
		var imgs = Meteor.http.call('GET', 'https://api.instagram.com/v1/tags/'+tag+'/media/recent?access_token='+token)
		return imgs;
	}
})

Router.route('/subscription', {where: 'server'}).get(function() {
	this.response.end(this.request.query["hub.challenge"])
}).post(function() {
	//Fetch the new images
	this.response.end("Hi")
})