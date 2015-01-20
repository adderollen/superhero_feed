Meteor.methods({
	getImages: function (tag, token) {
		var imgs = Meteor.http.call('GET', 'https://api.instagram.com/v1/tags/'+tag+'/media/recent?access_token='+token)
		return imgs;
	}
})