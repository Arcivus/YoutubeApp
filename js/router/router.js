var app = app || {};

var Workspace = Backbone.Router.extend({
	routes:{
		'*filter': 'setFilter'
	},

	setFilter: function(param){
		if(param){
			param = param.trim();
		}
		app.PageFilter = param || '';
		app.Videos.trigger('filter');

	}
});

app.VideoRouter = new Workspace();
Backbone.history.start();