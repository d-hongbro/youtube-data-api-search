const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const KEY = 'AIzaSyCSlk6CXiXCryMFytkQ2-11VAO7xzwrzOk';
const WATCH_ENDPOINT = 'https://www.youtube.com/watch?v=';
const EMBED_ENDPOINT = 'http://www.youtube.com/embed/';
const CHANNEL_ENDPOINT = 'https://www.youtube.com/channel/';

function getNextDataFromApi(searchTerm,pageToken,callback) {
  const query = {
  	part: 'snippet',
  	key: `${KEY}`,
  	type: 'video',
  	q: `${searchTerm}`,
  	maxResults: 12,
  	pageToken: `${pageToken}`
  }
  $.getJSON(SEARCH_ENDPOINT, query, callback);
  console.log(query);
}

function getInitialDataFromApi(searchTerm,callback) {
  const query = {
  	part: 'snippet',
  	key: `${KEY}`,
  	q: `${searchTerm}`,
  	type: 'video',
  	maxResults: 12
  }
  $.getJSON(SEARCH_ENDPOINT, query, callback);
}

function setSearchQuery(query) {
	$('.search-results').data("query", query);
}

function getSearchQuery() {
	return $('.search-results').data("query");
}

function setNextPageToken(pageToken = '') {
	$('.search-results').data("next-page-token", pageToken);
}

function getNextPageToken() {
	return $('.search-results').data("next-page-token");
}

function shortenString(str, size) {
	console.log(`shortenString ${str} ${size}`);
	// shortens whatever was passed into it with ellipses
	return str.length > size ? `${str.substr(0, size)}...` : str;
}

// function renderPagination(data) {
// 	console.log(`renderPagination ran`);
// 	const nextPageToken = data.nextPageToken;
// 	const prevPageToken = 
// }

function renderResult(item, index) {
	// console.log(item.snippet);
	const snippet = item.snippet;
	const videoId = item.id.videoId;
	const channelTitle = item.snippet.channelTitle;
	const channelId = item.snippet.channelId;
	const thumbnail = item.snippet.thumbnails.medium.url;
	const videoTitle = item.snippet.title;
	const description  = shortenString(item.snippet.description, 60);
	// console.log(snippet);
	return `
<div class="col-4">
	<div class="js-video-card" data-index="${index}" data-channel-id="${channelId}">
		<div class="js-video-card-main" data-video-id="${videoId}">
			<div class="js-video-card-main-image">
				<img src="${thumbnail}" alt="${channelTitle}">
			</div>
			<div class="js-video-card-main-text">
				<p class="js-video-title">${videoTitle}</p>
				<p class="js-video-description">${description}</p>
			</div>
		</div>
	</div>
</div>
	`;
}

		// <div class="js-video-card-footer" data-channel-id="${channelId}">
		// 	<button class="js-view-more" >Visit Channel</button>
		// </div>

function displayYoutubeResult(data) {
	console.log(data);
	const results = data.items.map((item, index) => renderResult(item, index));
	$('.search-results').append(results);
	setNextPageToken(data.nextPageToken);
	setTimeout(() => {
		$('.js-end-page-message').text('Scroll to load more').removeClass('warning').addClass('good');
	}, 3000);
	
}

function listenToScrollBottom() {
	console.log(`listenToScrollBottom`);
	$(window).on("scroll", function() {
		let scrollHeight = $(document).height();
		let scrollPosition = $(window).height() + $(window).scrollTop();
		const query = getSearchQuery();
		const nextPageToken = getNextPageToken();
		if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
			console.log('reached end');
			$('.js-end-page-message').text('Loading more...').removeClass('good').addClass('warning');
			getNextDataFromApi(query,nextPageToken,displayYoutubeResult);
		}
	});
}

function listenToLightBoxExit() {
	$('body').on('click', '.lightbox',function(event) {
		if ( $(event.target).hasClass('lightbox') || ($(event.target).html() !== 'Visit Channel')) {
			event.preventDefault();
			$(event.currentTarget).toggleClass('hidden');
		}
	});
	$('body').on('dbclick', '.lightbox',function(event) {
		event.preventDefault();
	});
}

function listenToImageClick() {
	$('.search-results').on('click', '.js-video-card-main', (event) => {
		console.log('listenToVideoClick');
		// event.preventDefault();
		const index = $(event.currentTarget).closest('.js-video-card').data('index');
		const videoId = $(event.currentTarget).data('video-id');
		const videoEmbed = `${EMBED_ENDPOINT}${videoId}`;
		const channelId = $(event.currentTarget).closest('.js-video-card').attr('data-channel-id');
		const channelLink = `${CHANNEL_ENDPOINT}${channelId}`;
		// Going to open the video in a new window or lightbox
		$('object').attr("data", videoEmbed);
		$('.js-view-more').attr('href',channelLink);
		$('.lightbox').toggleClass('hidden');
	});
}

function listenToViewMoreClick() {
	$('.search-results').on('click', '.js-video-card-footer', (event) => {
		console.log('listenToViewMoreClick');
		event.preventDefault();
		const index = $(event.currentTarget).closest('.js-video-card').data('index');
		const channelId = $(event.currentTarget).find('.js-view-more').data('channelId');
		// Going to open a new window and bring up the channel with the ID...somehow
	});
}

function listenToSubmit() {
	$('.js-search-form').submit(event => {
		$('.search-results').empty();
		console.log('listenToSubmit ran');
	    event.preventDefault();
	    const queryTarget = $(event.currentTarget).find('input');
	    const query = queryTarget.val();
	    setSearchQuery(query);
	    queryTarget.val("");
	    setTimeout(() => {
	    	$('.js-end-page-message').removeClass('hidden')
	    }, 500);
	    getInitialDataFromApi(query,displayYoutubeResult);
	    $('.line').addClass('hidden');
    });
}

function handleYoutubePage() {
	console.log('Program is running');
	$(listenToSubmit);
	$(listenToImageClick);
	$(listenToViewMoreClick);
	$(setNextPageToken);
	$(listenToScrollBottom);
	$(listenToLightBoxExit);
}

$(handleYoutubePage);




