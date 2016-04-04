var app = app || {};

app.VideoList = Backbone.Collection.extend({
	model: app.Video,

	comparator: function(video){
		return video.get('viewCount');
	}
});

app.Videos = new app.VideoList();
