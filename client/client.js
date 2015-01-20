var auth_url = 'https://instagram.com/oauth/authorize';

var callback = 'http://localhost:3000/callback';
var subscription = 'http://localhost:3000/subscription';

var data = {
	client_id: '71ca540984ee43feac2eaf4e2fcfe99e',
	redirect_uri: callback,
	response_type: 'token',
	scope: 'basic'
}

var subscriptionData = {
	client_id: '71ca540984ee43feac2eaf4e2fcfe99e',
	callback_url: subscription,


}

//curl --data "client_id=71ca540984ee43feac2eaf4e2fcfe99e&client_secret=bc7a3edc408446c6964f34519504a6df&object=tag&aspect=media&object_id=nofilter&callback_url=http://superhjalte.meteor.com/subscription" https://api.instagram.com/v1/subscriptions/

Router.onBeforeAction(function() {
	if(!Session.get('currentToken')) {
		this.render('login')
	} else {
		var token = Session.get('currentToken');
		console.log(token)
		this.next()
	}
}, { except: ['callback'] })

Router.route('/callback', function() {
	var hash = this.params.hash;
	if(hash) {
		var data = Helpers.queryToObject(hash)
		AuthInformation.insert({token: data.access_token})
		Session.set('currentToken', data.access_token)
		this.redirect('/')
	}
})

Router.route('/', function() {
	this.render('home')
})

Router.route('/subscription', function() {
	console.log(params)
})


Template.login.events({
	'click a#insta-login': function(evt, template) {
		if(!Session.get('currentToken')) {
			window.location = auth_url + Helpers.toQueryString(data)
		}		
	}
})

Template.home.events({
	'click a#get-imgs': function(evt, template) {
		var tag = 'chalmersftw'
		Meteor.call('getImages', tag, Session.get('currentToken'), function(err, imgs) {
			console.log(imgs)
		})
	}
})
