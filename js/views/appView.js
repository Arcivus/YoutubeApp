var app = app || {};

app.AppView = Backbone.View.extend({
	el: "#ytApp",

	events: {
		'click #searchButton' : 'requestData',
		'change #sortTypeSelect': 'pickSortType',
		'keypress #search' : 'searchOnEnter'
	},

	initialize: function(){
		this.listenTo(app.Videos, 'filter', this.filterAll);
	},

	searchOnEnter: function(e){
		if(e.which === ENTER_KEY){
			this.requestData();
		};
	},

	requestViewsCount: function(id){
		var result;
		var url = "https://www.googleapis.com/youtube/v3/videos?part=statistics";
		var url = url + "&id=" + id;
		var url = url + "&key=AIzaSyC6oHj-Xpytf3jl20ELgOCVw-ioWDdgzOs";

		$.ajax({
			url: url,
			async: false,
			dataType: 'json',
			success: function(data){
				result = data.items[0].statistics.viewCount;
			}
		});

		return result;
	},

	newAttributes: function(item){
		var views = this.requestViewsCount(item.id.videoId);
		return{
			videoTitle: item.snippet.title,
			channelTitle: item.snippet.channelTitle,
			viewsCount: views,
			thumbnailURL: item.snippet.thumbnails.medium.url,
			id: item.id.videoId,
		};
	},

	renderVideo: function(item){
		var videoView = new app.VideoView({model: item});

		$("#videos").append(videoView.render().el);
	},

	createModels: function(items){
		var self = this;

		items.forEach(function(item){
			app.Videos.add(self.newAttributes(item));
		});

		this.pickSortType();
	},

	requestData: function(){
		this.resetRoute();
		app.Videos.reset();
		$("#videos").html("");

		var self = this;

		var query = $('#search').val().trim();

		var splitQuery = query.split(' ');
		if (splitQuery.length > 1){
			query = splitQuery[0];
			for(var i = 1; i < splitQuery.length; i++){
				query = query + "+" + splitQuery[i];
			}
		};

		var url = "https://www.googleapis.com/youtube/v3/search?part=snippet";
		url = url + "&maxResults=20";
		url = url + "&order=viewCount";
		url = url + "&q=" + query;
		url = url + "&type=video";
		url = url + "&key=AIzaSyC6oHj-Xpytf3jl20ELgOCVw-ioWDdgzOs";

		if(query){
			$.getJSON(url).done(function(data){
				if(data.items){
					self.createModels(data.items);
				} else {
					console.log('could not load videos from youtube');
				}
			}).fail(function(){
				console.log('Failed to get videos from youtube');
			});
		}
	},

	filterOne: function(video){
		video.trigger('visible');
	},

	filterAll: function(){
		app.Videos.each(this.filterOne, this);
	},

	orderByViews: function(){
		$('#videos').html('');
		this.resetRoute();
		app.Videos.each(function(video){
			video.set({order: app.Videos.indexOf(video) + 1});
			this.renderVideo(video);
		}, this);
	},

	orderByAlphabet: function(){
		var self = this;
		this.resetRoute();
		var sortedByAlphabet = app.Videos.sortBy(function(model){
			return model.get('videoTitle').toLowerCase();
		});
		$('#videos').html('');
		sortedByAlphabet.forEach(function(sortedModel){
			sortedModel.set({order: sortedByAlphabet.indexOf(sortedModel) + 1})
			self.renderVideo(sortedModel);
		});
	},

	pickSortType: function(){
		if($('#sortTypeSelect').val() === "byViews"){
			this.orderByViews();
		} else {
			this.orderByAlphabet();
		}
	},
	resetRoute: function(){
		app.PageFilter = '1';
		app.VideoRouter.navigate('#/1');
	}
});







