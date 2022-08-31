var NJQuery

const _config = {
	likeTag = "",
	adSquareTag = "width_ad",
	adHSquareTag = "height_ad",
	likeTag = "like_add",
	link = window.location.origin
}

let _data;
const _css = `
#card_width {max-width: 100%; cursor: default; display: none; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;background: radial-gradient(#76b2fe, #b69efe);height: 180px;width: 360px;border-radius: 12%;display: flex;}
#card_width:hover {box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);cursor: pointer;}
#container {margin-top: -18%;padding-left: 10%;}
.img_style {width:40%;padding: 4%;}
.img_height {height: 63%;padding: 7%;}
.text_desc {font-size: 15px;}
#card_height {height: 300px;width: 18%;cursor: default; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;background: radial-gradient(#76b2fe, #b69efe);border-radius: 12%;}
#card_height:hover {box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);cursor: pointer;}
`
const netsoc_add_width = (data) => {
	return  `
	<div id='card_width'>
	  <img src=${data.url}
			class="img_style" />
		<div id=''>
		  <h3>${data.name}</h3>
		  <span>${data.desc}</span>
		</div>
	  </div>
	`
};

const netsoc_add_height = (data) => {
	return `
	  <div class="card_height">
		<img src=${data.url}
			class="img_height" />
		<div id='container'>
		  <h3>${data.name}</h3>
		  <span class="text_desc">${data.desc}</span>
		</div>
	  </div>
	`
}

const netsoc_like_ad = (data) => {
	return `
	  <div class="card_height">
		<img src=${data.url}
			class="img_height" />
		<div id='container'>
		  <h3>${data.name}</h3>
		  <span class="text_desc">${data.desc}</span>
		</div>
	  </div>
	`
}

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];

    return item;
}

async function _load() {
	
	/* Put style */
	let style = document.createElement('style')
	style.type ='text/css'
    style.appendChild(document.createTextNode(_css))
	document.getElementsByTagName("head")[0].appendChild(style);

	/* Put font */
	let link = document.createElement("link");
  	link.rel = "stylesheet";
  	link.href = "https://fonts.googleapis.com/css?family=Lato&display=swap";
  	document.getElementsByTagName("head")[0].appendChild(link);
	if (NJQuery(`#${_config.adSquareTag}`).length !== 0) {
		const promise = await window.fetch('http://localhost:8080/website').then(async (res) => res.json())
		const result = getRandomItem(promise.websites);
		_data = result
		NJQuery(`#${_config.adSquareTag}`).html(netsoc_add_width(result ? {url: result.IMGURL, name: result.NAME, desc: result.DESCRIPTION} : {
			url: "https://pbs.twimg.com/media/FNe-GNSagAozP9D?format=jpg&name=large",
			name: "truc",
			desc: "some desc",
		}));
	}
	if (NJQuery(`#${_config.adHSquareTag}`).length !== 0) {
		const promise = await window.fetch('http://localhost:8080/website').then(async (res) => res.json())
		const result = getRandomItem(promise.websites);
		_data = result
		NJQuery(`#${_config.adSquareTag}`).html(netsoc_add_width(result ? {url: result.IMGURL, name: result.NAME, desc: result.DESCRIPTION} : {
			url: "https://pbs.twimg.com/media/FNe-GNSagAozP9D?format=jpg&name=large",
			name: "truc",
			desc: "some desc",
		}));
	}
}  

const _initJQuery = () => {
	NJQuery(() => {
		_load();

		NJQuery(document).on("click", "#card_width", async () => {
			window.fetch('http://localhost:8080/website/view',{
			  method: 'PATCH',
			  headers: {
			  	'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({
			  	id: _data.ID_LINK,
			  }),
			}).then(async (res) => {
				console.log(res)
				window.location.href = _data.LINK
			})
		})
		NJQuery(document).on("click", "#card_height", async () => {
			window.fetch('http://localhost:8080/website/view',{
			  method: 'PATCH',
			  headers: {
			  	'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({
			  	id: _data.ID_LINK,
			  }),
			}).then(async (res) => {
				console.log(res)
				window.location.href = _data.LINK
			})
		})
		
	})

}

/* Initialisation of jQuery */
(function(d, s, id){
	let jQueryOk = true
	if (!window.jQuery)
	  jQueryOk = false
	else {
	  const version = jQuery.fn.jquery
	  if (version.split('.')[0] < 3)
		jQueryOk = false
	}
  
	if (jQueryOk) {
		NJQuery = $.noConflict(true)
	  _initJQuery()
	} else {
	  var js, fjs = d.getElementsByTagName(s)[0]
	  if (d.getElementById(id)){ return }
	  js = d.createElement(s); js.id = id
	  js.onload = function(){
		NJQuery = $.noConflict(true);
		_initJQuery()
	  }
	  js.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"
	  fjs.parentNode.insertBefore(js, fjs)
	}
  }(document, 'script', 'jquery-netsoc'))