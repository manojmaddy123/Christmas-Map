var map;
var marker;
var popupInfo;

var amusementParks = [{
    title: 'Cedar Point',
    location: {
        lat: 41.482209,
        lng: -82.683520
    },

}, {
    title: 'Wild Waves Theme Park',
    location: {
        lat: 47.2744,
        lng: -122.311
    },

}, {
    title: 'Cliffs Amusement Park',
    location: {
        lat: 35.1432,
        lng: -106.5881
    },

}, {
    title: 'Hershey Park',
    location: {
        lat: 40.288783,
        lng: -76.654747
    },

}, {
    title: 'Disney Land',
    location: {
        lat: 33.812093,
        lng: -117.918975
    },

}, {
    title: 'Six Flags over Texas', //
    location: {
        lat: 32.7569,
        lng: -97.0703
    },

}, {
    title: "Walt Disney World",
    location: {
        lat: 28.3852,
        lng: -81.5639
    },

  }];
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
       center: {
           lat: 37.0902,
           lng: -95.7129
       },
       zoom: 4
   });

    popupInfo = new google.maps.InfoWindow();

    for (var i = 0; i < amusementParks.length; i++) {
        var position = amusementParks[i].location;
        var parks = amusementParks[i].title;
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: parks,
            icon: {
              url:'img/santmarker.png'
            },
            animation: google.maps.Animation.DROP,
            info: amusementParks[i].popupInfo
            });
        amusementParks[i].dropPin = marker;
        marker.addListener('click', function() {
            infowindow(this, popupInfo);
        });
    }
};

//Opens Wiki-Info on CLicking the marker

function infowindow(marker, popupInfo) {
    //Associating marker with Wikipedia API

    var marker = marker;
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",}).done(function(response) {
        var wikiVar = response[0];
        var url = 'http://en.wikipedia.org/wiki/' + wikiVar;
            if (popupInfo.marker != marker) {
                popupInfo.marker = marker;
                marker.addListener('click', toggleBounce(marker));
                popupInfo.setContent('<div class="popWindow">' + marker.title + '</div><br><a href="' + url + '">' + wikiVar + '</a>');
                popupInfo.open(map, marker);
                popupInfo.addListener("closeclick", function() {});
            }

        }).fail(function(jqXHR, textStatus) {
            alert("Failed to get wikipedia resources.Check the network connection!");
      });

  };

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2800);
    }
}

var ViewModal = function() {
    var self = this;
    self.amusementParks = ko.observable(amusementParks);
    self.clickOver = function(amusementParks) { // Makes the marker available for display
        map.setZoom(12); // Zoom is Set on Google Maps.
        map.setCenter(amusementParks.location);
        infowindow(amusementParks.dropPin, popupInfo);
    };

    self.discoverable = ko.observable('');
    self.discovery = ko.computed(function() {
        var newArray = ko.utils.arrayFilter(self.amusementParks(), function(themePark) {
            if (themePark.title.toLowerCase().indexOf(self.discoverable().toLowerCase()) >= 0) {
                if (themePark.dropPin) {
                    themePark.dropPin.setVisible(true);
                }
                return true;
            } else {
                if (themePark.dropPin) {
                    themePark.dropPin.setVisible(false);
                }
                return false;
            }
        });
        return newArray;
    });

};

// If Google Map fails to load...Browser Throws window alert..
var error = function() {
    alert('Ahhhhhhh.. Snap.....Google Maps hates slowwwwww server');
};


// Activates knockout.js
ko.applyBindings(new ViewModal());
