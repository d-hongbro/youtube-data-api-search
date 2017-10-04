const ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const KEY = 'AIzaSyCSlk6CXiXCryMFytkQ2-11VAO7xzwrzOk';

function getDataFromApi(searchTerm, callback) {
  const query = {
  	part: 'snippet',
  	key: `${KEY}`,
  	q: `${searchTerm}`,
  	type: 'video'
  }
  $.getJSON(ENDPOINT, query, callback);
}

function renderResult(item, index) {
	// console.log(item.snippet);
	const snippet = item.snippet;
	const videoId = item.id.videoId;
	const channelTitle = item.snippet.channelTitle;
	const channelId = item.snippet.channelId;
	const thumbnail = item.snippet.thumbnails.medium.url;
	const videoTitle = item.snippet.title;
	const description  = item.snippet.description;
	// console.log(snippet);
	return `
	<div class="js-video-card col-12" data-index="${index}">
		<div class="js-video-card-main" data-video-id="${videoId}">
			<div class="js-video-card-main-image">
				<img src="${thumbnail}" alt="${channelTitle}">
			</div>
			<div class="js-video-card-main-text">
				<p class="js-video-title">${videoTitle}</p>
				<p class="js-video-description">${description}</p>
			</div>
		</div>
		<div class="js-video-card-footer" data-channel-id="${channelId}">
			<p class="js-view-more" >View more from ${channelTitle}'s channel</p>
		</div>
	</div>
	`;
}

function displayYoutubeResult(data) {
	console.log(data);
	const results = data.items.map((item, index) => renderResult(item, index));
	$('.search-results').empty().append(results);
}

function listenToVideoClick() {
	$('.search-results').on('click', '.js-video-card-main', (event) => {
		console.log('listenToVideoClick');
		event.preventDefault();
		const index = $(event.currentTarget).closest('.js-video-card').data('index');
		const videoId = $(event.currentTarget).data('video-id');
		// Going to open the video in a new window or lightbox
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
		console.log('listenToSubmit ran');
	    event.preventDefault();
	    const queryTarget = $(event.currentTarget).find('input');
	    const query = queryTarget.val();
	    queryTarget.val("");
	    getDataFromApi(query, displayYoutubeResult);
    });
}

function handleYoutubePage() {
	console.log('Program is running');
	$(listenToSubmit);
	$(listenToVideoClick);
	$(listenToViewMoreClick);
}

$(handleYoutubePage);




