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
		this.next()
	}
}, { except: ['callback', 'johanpwns'] })


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

Router.route('/johanpwns', function() {
	this.render('admin')
})


Template.login.events({
	'click a#insta-login': function(evt, template) {
		if(!Session.get('currentToken')) {
			window.location = auth_url + Helpers.toQueryString(data)
		}
	}
})

Template.registerHelper('formatDate', function(date, format) {
	return moment(date).format(format)
})

var mock = {
	img: {
		created_time: new Date().valueOf(),
		images: {
			standard_resolution: {
				url: 'http://placekitten.com/g/640/640'
			}
		},
		user: {
			full_name: 'Johan Brook',
			profile_picture: 'http://placekitten.com/g/64/64'
		},
		caption: {
			text: 'Lorem ipsum dorelt istamet oawjd awdoaid awjdi.'
		},
		likes: {
			count: 10
		}
	}
}

Template.admin.helpers({
	tag: function() {
		return Tags.findOne()
	}
})

Template.admin.events({
	'submit #new-tag-form': function(evt, tmpl) {
		evt.preventDefault()

		var val = tmpl.find('#tag').value

		if(!val) return console.warn('You must fill in a tag!')

		Meteor.call('trackNewTag', val, function(err, res) {
			if(err) return console.error(err)

			console.log('Set new tag to '+val)
		})
	},

	'click a#clear-insta-data': function(evt, template) {
		Meteor.call('clearInstaData', function(err, res) {
			if(!err) {
				console.log('Cleared data!')
			}
			else {
				console.error(err.reason)
			}
		})
	}
})

Template.home.helpers({
	imgs: function() {
		return Imgs.find({}, {sort: {createdAt: -1}});
	},
	date: function() {
		return moment()
	},
	tag: function() {
		return Tags.findOne()
	}
})

Template.image.helpers({
	timeAgo: function() {
		return moment(this.created_time).fromNow()
	}
})

Template.home.rendered = function(){
	Tracker.autorun(function() {
		var x = InstaUpdates.find().fetch();
		Meteor.call('getNewImgs', Session.get('currentToken'),function(err, res) {
			if(err) {
				if(err.error === 403) {
					console.warn('No access token provided. You need to auth first, noob.')
				}
			}
		})
	})
}
