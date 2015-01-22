var auth_url = 'https://instagram.com/oauth/authorize';

//var callback = 'http://localhost:3000/callback';
var callback = 'http://superhjalte.meteor.com/callback';

var data = {
	client_id: '71ca540984ee43feac2eaf4e2fcfe99e',
	redirect_uri: callback,
	response_type: 'token',
	scope: 'basic'
}

//curl "https://api.instagram.com/v1/subscriptions/client_id=71ca540984ee43feac2eaf4e2fcfe99e&client_secret=bc7a3edc408446c6964f34519504a6df&object=tag&aspect=media&object_id=nofilter&callback_url=http://superhjalte.meteor.com/subscription"

// curl https://api.instagram.com/v1/subscriptions/?client_secret=bc7a3edc408446c6964f34519504a6df&client_id=71ca540984ee43feac2eaf4e2fcfe99e

//https://api.instagram.com/v1/subscriptions?client_secret=CLIENT-SECRET&client_id=CLIENT-ID

Router.onBeforeAction(function() {
	if(!Session.get('currentToken')) {
		this.render('login')
	} else {
		var token = Session.get('currentToken');
		this.next()
	}
}, { except: ['callback'] })

Router.route('/callback', function() {
	var hash = this.params.hash;
	if(hash) {
		var data = Helpers.queryToObject(hash)
		Session.set('currentToken', data.access_token)
		this.redirect('/')
	}
})

Router.route('/', function() {
	this.render('home')
})




Template.login.events({
	'click a#insta-login': function(evt, template) {
		if(!Session.get('currentToken')) {
			window.location = auth_url + Helpers.toQueryString(data)
		}		
	},

	'click a#clear-insta-data': function(evt, template) {
		Meteor.call('clearInstaData', function(err, res) {
			
		})
	}
})

Template.home.helpers({
	imgs: function() {
		return Imgs.find({}, {sort: {createdAt: -1}});
	}
})

Template.home.rendered = function(){
	Tracker.autorun(function() {
		var x = InstaUpdates.find().fetch();
		Meteor.call('getNewImgs', Session.get('currentToken'),function(err, res) {
		})
	})
}
