/**
 * Blogger Eklentileri
 * Ücretsiz blogger eklentileri ve şablonları.
 * URL: https://plus.google.com/u/0/+BloggerGruplar%C4%B1/posts
 * TEMPLATES: &lt;div id="goofed-be"&gt;&lt;span class="Yükleniyor"&gt;Yükleniyor...&lt;/span&gt;&lt;/div&gt;&lt;script type="text/javascript"&gt;var goofedbe = {blogUrl:"https://cizgifilmhikayeleri.blogspot.com", containerId: "goofed-be", activeTab: 1};&lt;/script&gt;&lt;script type="text/javascript" src="js/goofed-be.js"&gt;&lt;/script&gt;
 */

var goofedbe_defaults = {
	blogUrl: "https://www.dte.web.id",
	containerId: "goofed-be",
	activeTab: 1,
	showDates: false,
	showSummaries: false,
	numChars: 200,
	showThumbnails: false,
	thumbSize: 40,
	noThumb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAA3NCSVQICAjb4U/gAAAADElEQVQImWOor68HAAL+AX7vOF2TAAAAAElFTkSuQmCC",
	monthNames: [
		"Ocak",
		"Şubat",
		"Mart",
		"Nisan",
		"Mayıs",
		"Haziran",
		"Temmuz",
		"Ağustos",
		"Eylül",
		"Ekim",
		"Kasım",
		"Aralık"
	],
	newTabLink: true,
	maxResults: 99999,
	preload: 0, // (option => time in milliseconds || "onload")
	sortAlphabetically: true,
	showNew: false, // `yanlış` "Yeni!"
	newText: " - <em style='color:red;'>Yeni!</em>" // HTML "Yeni!" text
};

for (var i in goofedbe_defaults) {
	goofedbe_defaults[i] = (typeof(goofedbe[i]) !== undefined && typeof(goofedbe[i]) !== 'undefined') ? goofedbe[i] : goofedbe_defaults[i];
}

function clickTab(pos) {
	var a = document.getElementById(goofedbe_defaults.containerId),
		b = a.getElementsByTagName('ol'),
		c = a.getElementsByTagName('ul')[0],
		d = c.getElementsByTagName('a');
	for (var t = 0; t < b.length; t++) {
		b[t].style.display = "none";
		b[parseInt(pos, 10)].style.display = "block";
	}
	for (var u = 0; u < d.length; u++) {
		d[u].className = "";
		d[parseInt(pos, 10)].className = "active-tab";
	}
}

function showTabs(json) {

	var total = parseInt(json.feed.openSearch$totalResults.$t,10),
		c = goofedbe_defaults,
		entry = json.feed.entry,
		category = json.feed.category,
		skeleton = "",
		newPosts = [];

	for (var g = 0; g < (c.showNew === true ? 5 : c.showNew); g++) {
		if (g == entry.length) break;
		entry[g].title.$t = entry[g].title.$t + (c.showNew !== false ? c.newText : '');
	}

	entry = c.sortAlphabetically ? entry.sort(function(a,b) {
		return (a.title.$t.localeCompare(b.title.$t));
	}) : entry;
	category = c.sortAlphabetically ? category.sort(function(a,b) {
		return (a.term.localeCompare(b.term));
	}) : category;

	skeleton = '<span class="divider-layer"></span><ul class="be-tabs">';
	for (var h = 0, cen = category.length; h < cen; h++) {
		skeleton += '<li class="be-tab-item-' + h + '"><a href="javascript:clickTab(' + h + ');">' + category[h].term + '</a></li>';
	}
	skeleton += '</ul>';

	skeleton += '<div class="be-content">';
	for (var i = 0, cnt = category.length; i < cnt; i++) {
		skeleton += '<ol class="panel" data-category="' + category[i].term + '"';
		skeleton += (i != (c.activeTab-1)) ? ' style="display:none;"' : '';
		skeleton += '>';
		for (var j = 0; j < total; j++) {
			if (j == entry.length) break;
			var link, entries = entry[j],
				pub = entries.published.$t,
				month = c.monthNames,
				title = entries.title.$t,
				summary = ("summary" in entries && c.showSummaries === true) ? entries.summary.$t.replace(/<br ?\/?>/g," ").replace(/<.*?>/g,"").replace(/[<>]/g,"").substring(0,c.numChars) + '&hellip;' : '',
				img = ("media$thumbnail" in entries && c.showThumbnails === true) ? '<img class="thumbnail" style="width:'+c.thumbSize+'px;height:'+c.thumbSize+'px;" alt="" src="' + entries.media$thumbnail.url.replace(/\/s72(\-c)?\//,"/s"+c.thumbSize+"-c/") + '"/>' : '<img class="thumbnail" style="width:'+c.thumbSize+'px;height:'+c.thumbSize+'px;" alt="" src="' + c.noThumb.replace(/\/s72(\-c)?\//,"/s"+c.thumbSize+"-c/") + '"/>',
				cat = (entries.category) ? entries.category : [],
				date = (c.showDates) ? '<time datetime="' + pub + '" title="' + pub + '">' + pub.substring(8,10) + ' ' + month[parseInt(pub.substring(5,7),10)-1] + ' ' + pub.substring(0,4) + '</time>' : '';
				
			for (var k = 0; k < entries.link.length; k++) {
				if (entries.link[k].rel == 'alternate') {
					link = entries.link[k].href;
					break;
				}
			}
			for (var l = 0, check = cat.length; l < check; l++) {
				var target = (c.newTabLink) ? ' target="_blank"' : '';

				if (cat[l].term == category[i].term) {
					skeleton += '<li title="' + cat[l].term + '"';
					skeleton += (c.showSummaries) ? ' class="bold"' : '';
					skeleton += '><a href="' + link + '"' + target + '>' + title + date + '</a>';
					skeleton += (c.showSummaries) ? '<span class="summary">' + img + summary + '<span style="display:block;clear:both;"></span></span>' : '';
					skeleton += '</li>';
				}
			}
		}
		skeleton += '</ol>';
	}

	skeleton += '</div>';
	skeleton += '<div style="clear:both;"></div>';
	document.getElementById(c.containerId).innerHTML = skeleton;
	clickTab(c.activeTab-1);

}

(function() {
	var h = document.getElementsByTagName('head')[0],
		s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = goofedbe_defaults.blogUrl + '/feeds/posts/summary?alt=json-in-script&max-results=' + goofedbe_defaults.maxResults + '&orderby=published&callback=showTabs';
	if (goofedbe_defaults.preload !== "onload") {
		setTimeout(function() {
			h.appendChild(s);
		}, goofedbe_defaults.preload);
	} else {
		window.onload = function() {
			h.appendChild(s);
		};
	}
})();