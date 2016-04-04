var app = app || {};

app.VideoView = Backbone.View.extend({
	tagName: 'div',
	className: 'videoContainer',
	template: _.template($('#video-template').html()),

	initialize: function(){
		this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	render: function(){
		this.$el.html(this.template(this.model.attributes));
		this.toggleVisible();

		return this;
	},

	toggleVisible: function(){
		this.$el.toggleClass('hidden', this.isHidden());

	},

	isHidden: function(){
		var order = this.model.get('order');

		return(
			( (order > 5) && (app.PageFilter === "1") )
			||( ((order <= 5 ) || (order > 10)) && (app.PageFilter === "2") )
			||( ((order <= 10) || (order > 15)) && (app.PageFilter === "3") )
			||( (order <= 15) && (app.PageFilter === "4") )
			);
	}
});