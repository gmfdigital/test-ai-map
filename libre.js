var continentToggleContainer = document.querySelector(".continent-toggle-container");
var unitedStatesToggle = document.querySelector("#united-states");
var europeToggle = document.querySelector("#europe");
var USAbbox = [[-125, 51], [-68,20 ]];
var EUbbox = [[-12, 61], [44,30 ]];
var legend = document.querySelector(".legend"); //LIBRE
var categoryContainer = document.querySelector(".category-container"); //LIBRE
map.changingContinent = false; 

unitedStatesToggle.addEventListener("click", function(){
	toggleClass(unitedStatesToggle, europeToggle, "clicked");
	fullPopup('clear', 'clear');
	map.once('movestart', () => { map.changingContinent = true; });
	map.fitBounds(USAbbox, {
		padding: {top: 50, bottom:20, left: 5, right: 5}
	});
	map.once('moveend', () => { map.changingContinent = false; });
});
unitedStatesToggle.addEventListener("mouseover", peekDirection);

europeToggle.addEventListener("click", function(){ 
	toggleClass(europeToggle, unitedStatesToggle, "clicked");
	fullPopup('clear', 'clear');
	map.once('movestart', () => { map.changingContinent = true; });
	map.fitBounds(EUbbox, {
		padding: {top: 50, bottom:20, left: 5, right: 5}
	});
	map.once('moveend', () => { map.changingContinent = false; });
});
europeToggle.addEventListener("mouseover", peekDirection);

function toggleClass(elementToAdd, elementToRemove, classToToggle) {
	elementToAdd.classList.add(classToToggle);
	elementToRemove.classList.remove(classToToggle); 
}

function checkContinent() {
	const {lng, lat} = map.getCenter();
	if (lng > -30) { 
		toggleClass(europeToggle, unitedStatesToggle, "active");
		toggleClass(europeToggle, unitedStatesToggle, "clicked")	
	} 
	if (lng < -30) { 
		toggleClass(unitedStatesToggle, europeToggle, "active");
		toggleClass(unitedStatesToggle, europeToggle, "clicked")	 
	} 
} 


function peekDirection() { //works

	initialCenter = map.getCenter();
	initialZoom = map.getZoom();
	
	var centerPoint = map.project(initialCenter);
	console.log(map);
  if( event.type == "mouseover" && event.target.classList.contains('clicked') == false && map.changingContinent == false){ // shift left
  	console.log("mouseover")
		var peekCenterPoint = [
			centerPoint.x - window.screen.width/20,
			centerPoint.y
		]
		var peekCenter = map.unproject(peekCenterPoint);
			map.easeTo({
			// center: [peekCenter.lng, peekCenter.lat],
			zoom: initialZoom -.3,
			speed: 0.2,
			curve: 1,
			duration: 5000,
			easing(t) {
				return t * (2 - t);
			}
		});
  }
  event.target.addEventListener("mouseout", function(){
  		if( event.type == "mouseout" && event.target.classList.contains('clicked') == false && map.changingContinent == false){ // return map center
		  	console.log("mouseout")	
				var unPeekCenterPoint = [
					centerPoint.x + window.screen.width/20,
					centerPoint.y
				]
				var unPeekCenter = map.unproject(unPeekCenterPoint);
				map.easeTo({
					// center: initialCenter,
					zoom: initialZoom,
					speed: 0.2,
					curve: 1,
					duration: 100,
					easing(t) {
						return t * (2 - t);
					}
				});
		  }
  });
}


function fullPopup(f, task) {

		f = f || null;	
		var main = document.querySelector('.main');

		if (task == 'clear') {
				selectedPopup.remove();
				main.innerHTML = ''; //clear main
				return; //return if clearing
		} if (task == 'create') {
				main.innerHTML = ''; //clear main
				var contentContainer = Object.assign(document.createElement('div'), { 
					className: 'content-container popup-container' 
				});
				main.appendChild(contentContainer);
				var popup = Object.assign(document.createElement('div'), { 
					className: 'popup' 
				});
				contentContainer.appendChild(popup);
				var popupControls = Object.assign(document.createElement('div'), { 
		    	innerHTML: ``,
					className: 'popup-controls' 
				});
				popup.appendChild(popupControls);
				var popupContent = Object.assign(document.createElement('div'), { 
		    	innerHTML: 
		    	 `<div class="popup-header">
		    	 		<div class="meta-bar">
		    				<div class="meta-box location-meta">
		    						${(f.properties.date) ? '<p>' + f.properties.date + '</p>': `` }
		    				</div>
		    				<div class="meta-box location-meta">
			    					<img class="country-flag" crossorigin="anonymous" src="${getFlagURL(f.properties['country-code'])}"> ${(f.properties.location) ? '<p>' + f.properties.location + '</p>': `` }
		    				</div>
		    	 		</div>
		    	 		<div class="title">
		    	 			${(f.properties.heading) ? '<h2 class="heading">' + f.properties.heading + '</h2>': `` }
		    	 			${(f.properties.event) ? '<h4 class="event">' + f.properties.event + '</h4>': `` }
		    	 		</div>
		    	 	</div>
		    	 	<div class="popup-body">
		    	 		<section class="stat-section ${(f.properties.category) ? 'supplied' : ``}">
		    	 			<div class="stat-container ${(f.properties.category) ? 'supplied' : `hide` }">
			    	  		${(f.properties.category) ? 
			    	  		'<p class="label">CATEGORY</p>' +
		    	  			'<p class="stat">' + f.properties.category + '</p>'
		    	  			: `` }
			    	  	</div>
		    	  	</section>
		    	 		<section class="stat-section ${(f.properties.amount || f.properties['type']) ? 'supplied' : ``}">
		    	 			<div class="stat-container ${(f.properties.amount) ? 'supplied' : `hide` }">
			    	  		${(f.properties.amount) ? 
			    	  		'<p class="label">INVESTMENT</p>' +
		    	  			'<p class="stat">' + f.properties.amount + '</p>' +
		    	  			'<p class="footnote ' + checkProperty(addProperty(f.properties['amount-description'])) + '">' + addProperty(f.properties['amount-description']) + '</p>'
		    	  			: `` }
			    	  	</div>
			    	  	<div class="stat-container ${(f.properties['type']) ? 'supplied' : `hide`} ">
			    				${(f.properties['type']) ? 
			    	  		'<p class="label">TYPE</p>' +
			    				'<p class="stat">' + f.properties['type'] + '</p>' +
		    	  			'<p class="footnote ' + checkProperty(addProperty(f.properties['type-description'])) + '">' + addProperty(f.properties['type-description']) + '</p>'
									: `` }
			    			</div>
			    		</section>
		    	 		<section class="stat-section jobs ${(f.properties['direct-jobs'] || f.properties['indirect-jobs']) ? 'supplied' : ``}">
		    	 			<div class="stat-container ${(f.properties['direct-jobs']) ? 'supplied' : `hide` }">
			    	  		${(f.properties['direct-jobs']) ? 
			    	  		'<p class="label">DIRECT JOBS</p>' +
		    	  			'<p class="stat">' + f.properties['direct-jobs'] + '</p>' 
		    	  			: `` }
			    	  	</div>
			    	  	<div class="stat-container ${(f.properties['indirect-jobs']) ? 'supplied' : `hide`} ">
			    				${(f.properties['indirect-jobs']) ? 
			    	  		'<p class="label">INDIRECT JOBS</p>' +
			    				'<p class="stat">' + f.properties['indirect-jobs'] + '</p>' 
									: `` }
			    			</div>
			    		</section>
			    	</div>
		    		<div class="popup-footer">
		    			<div class="sources">
	    							${(f.properties['source1'] || f.properties['source1-label'] || f.properties['source2'] || f.properties['source2-label'] || f.properties['source3'] || f.properties['source3-label'] || f.properties['source4'] || f.properties['source4-abel']) ? '<p class="label">SOURCES</p>': ``}
	    							<ol>
		    							${(f.properties['source1'] || f.properties['source1-label']) ? '<li class="source" ><a href="' + f.properties['source1'] + '" target="_blank" >' + f.properties['source1-label'] + '</a></li>': ``}
		    							${(f.properties['source2'] || f.properties['source2-label']) ? '<li class="source" ><a href="' + f.properties['source2'] + '" target="_blank" >' + f.properties['source2-label'] + '</a></li>': ``}
		    							${(f.properties['source3'] || f.properties['source3-label']) ? '<li class="source" ><a href="' + f.properties['source3'] + '" target="_blank" >' + f.properties['source3-label'] + '</a></li>': ``}
		    							${(f.properties['source4'] || f.properties['source4-label']) ? '<li class="source" ><a href="' + f.properties['source4'] + '" target="_blank" >' + f.properties['source4-label'] + '</a></li>': ``}
		    						</ol>
		    			</div>
		    		</div>`,
					className: 'popup-content' 
				});
				popup.appendChild(popupContent);		
		}
}


let addProperty = (prop) => (prop) ? prop : '';
let checkProperty = (prop) => (prop) ? 'true' : 'false';
// let getFlagURL = (countryCode) => 'https://countryflagsapi.com/svg/' + countryCode.toLowerCase();
let getFlagURL = (countryCode) => 'https://flagcdn.com/' + countryCode.toLowerCase() + '.svg';  // flag codes: https://flagcdn.com/en/codes.json



function getFlagEmoji(countryCode) { //works
  const codePoints = countryCode
    .toLowerCase()
    .split('')
  return String.fromCodePoint(...codePoints);
}

// Hover Popup
const hoverpopup = new maplibregl.Popup({
		closeButton: false,
		closeOnClick: false,
		className: 'hover-popup preview',
		closeOnMove: false,
		maxWidth: '300px',
		offset: 10
});

function createHoverPopup(f) { // create popup
	  var popupString = "<div class='feature'>";
  	popupString += "<p class='heading'>" + f.properties.heading + "</p>";
  	popupString += "</div>";
		hoverpopup.setLngLat(f.geometry.coordinates);
		hoverpopup.setHTML(popupString);
		hoverpopup.addTo(map);
}

const selectedPopup = new maplibregl.Popup({
		closeButton: false,
		closeOnClick: false,
		className: 'selected-popup preview',
		closeOnMove: false,
		maxWidth: '300px',
		offset: 10
});

function createSelectedPopup(f) { // create popup
	  var popupString = "<div class='feature'>";
  	popupString += "<p class='heading'>" + f.properties.heading + "</p>";
  	popupString += "</div>";
		selectedPopup.setLngLat(f.geometry.coordinates);
		selectedPopup.setHTML(popupString);
		selectedPopup.addTo(map);
}


//////////////////////////////////
// SEMICONDUCTOR LAYER BEHAVIOR //


map.on('click', (event) => {
		console.log("click event: ", event, "zoom: ", map.getZoom());
	  const features = map.queryRenderedFeatures(event.point, {  // If the user clicked on one of your markers, get its information.
	    layers: ['semiconductors-id'] // layer name
	  });
	  if (!features.length) { // NO FEATURES CLICKED
				fullPopup('clear', 'clear');
				hoverpopup.remove();
				selectedPopup.remove();
	  		return;
	  }
	  if (features.length) { // FEATURES CLICKED
  		  const feature = features[0];
			  console.log("clicked feature: ", feature);
				createSelectedPopup(feature);

				map.easeTo({
					center: feature.geometry.coordinates,
					duration: 700,
				});

				fullPopup(feature, 'create');
	  }
});


map.on("mouseenter", "semiconductors-id", (event) => {
      map.getCanvas().style.cursor = "pointer";
      const features = map.queryRenderedFeatures(event.point, { layers: ['semiconductors-id'] });
      if (!features.length) { return }
		  const feature = features[0];

			createHoverPopup(feature);

			map.setFeatureState(
				{ source: 'semiconductors', id: 'semiconductors-id' },
				{ hover: true })
});

map.on("mouseleave", "semiconductors-id", () => {
			hoverpopup.remove();
      map.getCanvas().style.cursor = "default";
});


// inspect a cluster on click
map.on('click', 'clusters-circle-id', (e) => {
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['clusters-circle-id']
		});
		const clusterId = features[0].properties.cluster_id;
			map.getSource('semiconductors').getClusterExpansionZoom(
			clusterId,
			(err, zoom) => {
				if (err) return;
				map.easeTo({
					center: features[0].geometry.coordinates,
					zoom: zoom
				});
			}
		);
});


map.on('mouseenter', 'clusters-circle-id', (event) => {

		map.getCanvas().style.cursor = 'pointer';
	  var clusterId = event.features[0].properties.cluster_id;
	  var clusterCenter = event.features[0].geometry.coordinates;
	  var pointCount = event.features[0].properties.point_count;
	  var clusterSource = map.getSource('semiconductors');

	  var clusterFeatures = [];
	  clusterSource.getClusterLeaves(clusterId, pointCount, 0, function(error, features) {
	    features.forEach(feature => {
				clusterFeatures.push(feature);
			})
			createPopup(); // call popup function once array is loaded
	  });

	  function createPopup() {
	  	console.log("clusterFeatures: ", clusterFeatures);
		  var popupString = "";
		  clusterFeatures.forEach(feature => {
		  	popupString += "<div class='feature'>";
		  	popupString += "<p class='title'>" + feature.properties.title + "</p>";
		  	popupString += "</div>";
		  })

			hoverpopup.setLngLat(clusterCenter);
			hoverpopup.setHTML(popupString);
			hoverpopup.addTo(map);
	  }
	  
});

map.on('mouseleave', 'clusters-circle-id', (event) => {
		map.getCanvas().style.cursor = '';
		hoverpopup.remove();
});

//////////////////////////////////
//////////////////////////////////

map.on('load', () => {
	settings.mapSettings.categories.forEach(category => {
		var legendEntry = Object.assign(.createElement('div'), { 
			innerHTML: `<span style="background-color:${(category.color)}"></span>${(category.label)}`,
			className: 'legend-entry' 
		});
		categoryContainer.appendChild(legendEntry);
	})
	categoryContainer.appendChild(Object.assign(.createElement('div'), { 
			innerHTML: `<span style="background-color: hsl(42, 0%, 60%)"></span>Other`,
			className: 'legend-entry' 
		}));
})

map.on('move', () => { 
	checkContinent();
});
//Button

let isPanning = false;

document.getElementById('pan-button').addEventListener('click', () => {
  if (isPanning) {
    isPanning = false; // Stop panning if already panning
    return;
  }

  isPanning = true; // Start panning
  const startCenter = map.getCenter();
  const panSpeed = 0.1; // Adjust speed as needed
  let currentLng = startCenter.lng;
  let startTime = null;

  function panAroundGlobe(timestamp) {
    if (!isPanning) return; // Stop panning if flag is false

    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    currentLng += panSpeed;
    if (currentLng >= startCenter.lng + 180) {
      map.easeTo({
        center: [startCenter.lng, startCenter.lat],
        zoom: 2,
        speed: 2, // Adjust speed as needed
        curve: 1,
        easing(t) {
          return t;
        },
        essential: true
      });
      isPanning = false; // Stop after one full rotation
      return;
    }

    map.easeTo({
      center: [currentLng, startCenter.lat],
      zoom: 2,
      speed: 2, // Adjust speed as needed
      curve: 1,
      easing(t) {
        return t;
      },
      essential: true
    });

    requestAnimationFrame(panAroundGlobe);
  }

  requestAnimationFrame(panAroundGlobe);
});
