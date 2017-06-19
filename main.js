var map;
var marks= [];
var placemarks= [];
var markr;

var locs = [
           {id: 1, title: 'Shimla', location: {lat: 31.104605, lng: 77.173424}},
           {id: 2, title: 'Kullu',location: {lat: 31.957851, lng: 77.109459}},
           {id: 3, title: 'Manali',location: {lat: 32.2396, lng: 77.1887}},
           {id: 4, title: 'Dharamsala',location: {lat: 32.22006, lng: 76.32013}},
           {id: 5, title: 'Palampur',location: {lat: 32.1109, lng: 76.5363}},
           {id: 6, title: 'Kangra',location: {lat: 32.0998, lng:76.2691}}
           ];

function getMarkerIcon(markercolor){
    var markImage= new google.maps.MarkerImage('https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|home|'
        + markercolor + '|#000000',
        new google.maps.Size(21,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10,34),
        new google.maps.Size(21,34)

        );
    return markImage;
}

//initializing the map
function initMap() {
    var mcords = {lat: 31.1048, lng: 77.1734};
    map = new google.maps.MAp(document.getElementById('map'),{
        zoom: 13,
        center: mcords
    });
    setMarkers(map);
}

function setMarkers(map) {
    var lIwindow= new google.maps.InfoWindow();
    var dIcon= getMarkerIcon('#FF0000');
    var highIcon= getMarkerIcon('#ffffff');
    var latlang= new google.maps.LatLngBounds();
    for (var k = 0; k < locs.length; k++) {
        var pos= locs[k].location;
        var title= locs[k].title;
        var markr= new google.google.maps.Marker({
            map: map,
            title: title,
            position: pos,
            id: k,
            animation: google.maps.Animation.DROP
            });
        marks.push(markr);
        markr.addListener('mouseover', markin);
        markr.addListener('mouseout', markout);
        markr.addListener('click', markClick);
        latlang.extend(marks[k].position);
    }
    map.fitBounds(latlang);
    var sbox= new google.maps.places.SearchBox(document.getElementById('places-find'));
    sbox.setBounds(map.getBounds());
    sbox.addListener('places_changed',function(){
        sBoxPlaces(this);
    });
    //highlighted icon
    function markin(){
        this.setIcon(highIcon);
    }
    //hide marker
    function markout(){
        this.setIcon(null);
    }
    //when marker is clicked
    function markClick(){
        console.log("Hello");
        popiwindow(this, lIwindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        var p= this;
        sTout(function(){
            p.setAnimation(null);
        },1500);
    }

}

//Create markers for places
function createMarks(places){
    var latlang= new google.maps.LatLngBounds();
    for (var k = 0; k < places.length; k++) {
        var plac= places[k];
        var icon= {
            url:plac.icon,
            size: new google.maps.Size(35,35),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(15,34),
            scaledSize: new google.maps.Size(25,25)
        };
        var markr = new google.maps.Marker({
            title: plac.name,
            icon: icon,
            map: map,
            id: plac.id,
            position: plac.geometry.location
        });
        placemarks.push(markr);
        if (plac.geometry.viewport) {
            latlang.union(plac.geometry.viewport);
        }else{
            latlang.extend(plac.geometry.location);
        }
    }
    map.fitBounds(latlang);

}

//function to hide markers
function hideMarks(marks){
    for (var i = 0; i < marks.length; i++) {
        marks[i].setMap(null);
    }
}

//error handling
function displayError() {
    window.alert("Oops Somethings Wrong");
}

//searchbox
function sBoxPlaces(sbox){
    hideMarks(placemarks);
    var places = sbox.getPlaces();
    createMarks(places);
    //error handling
    if(places.length === 0){
        window.alert("Query not Found ...")
    }
}

//when a search is made by the client
function sboxMethod(value){
    console.log(val);
    var latlang= map.getBounds();
    hideMarks(placemarks);
    var pService= new google.maps.places.PlacesService(map);
    pService.textSearch({
        query: value,
        bounds: latlang
    },
    function(results, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarks(results);
        }else{
            window.alert("Sorry try again");
        }
    }
    );
}

//funtion to fill infowindow with wikilinks and streetview
function populateInfoWindow(markr,infoWindow){

    var flag=true;

    function getStreetView(data, status){
        if(status == google.maps.StreetViewStatus.OK){
            var nearStreetLoc= data.location.latLang;
            var head= google.maps.geometry.spherical.computeHeading(
                nearStreetLoc,
                markr.position
                );
            //handling the error
            var errorTout= setTimeout(function(){
                alert("Somethings wrong");
            },9000);
            clearTimeout(errorTout);

            var panOptions= {
                position: nearStreetLoc,
                pov: {
                    heading: head,
                    pitch: 30
                }
            };
            var pan= new google.maps.StreetViewPanorama(
                document.getElementById('panorama'),panOptions
                );
        }else {
            flag= false;
        }
    }
    //check to ensure the infowindow is not already opened
    if(infowindow.marker != markr){
        //clear the infowindow
        infowindow.SetContent('');
        infowindow.marker= markr;
        //Ensure that the marker property is cleared if infowinow is closed
        infowindow.addListener('closeclick',function(){
            if(infowindow.marker !== null)
                infowindow.marker.setAnimation(null);
            infowindow.marker= null;
        });

    var streetService = new google.maps.StreetViewService();
    var radius= 40;

    infowindow.open(map, markr);
    var wikiElem= '';
    var wikiFlag= false;

    infowindow.open(map,markr);

    var wikiTout= setTimeout(function(){
        wikiElem= 'Failed to Resolve';
    },9000);

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
        markr.title + '&format=json&callback=wikiCallback';

    $.ajax({
        url: wikiUrl, datatype: "jsonp",
        success: function(data){
            wikiFlag=true;
            for (var i = 0; i < data.length; i++) {
                var artList= data[i];
                for (var j = 0; j < artList.length; j++) {
                    articlestr = artList[i];
                    if(articlestr.length > wikiElem.length){
                        wikiElem= articlestr;
                    }
                }
            }
            if(flag === false){
                infowindow.SetContent(
                    '<div><h4 id="Title" class=".h4">' + markr.title +
                    '</h4></div>' + '<div class="text-right" id="wiki-links"' + wikiElem +
                    '<p></p></div>' + '<div id="panorama"><span><i>View Not Found</i></span></div>'
                );
            }else{
                infowindow.SetContent(
                    '<div><h4 id="Title" class=".h4">' + markr.title +
                    '</h4></div>' + '<div class="text-right" id="wiki-links"' + wikiElem +
                    '<p></p></div>' + '<div id="panorama">' + streetService.getPanoramaByLocation(markr.position, radii, getStreetView) +
                    '</div>'
                );
            }
            clearTimeout(wikiTout);
        }
    //error handling
    }).fail(function(jqXHR, textStatus){
        if(jqXHR.status === 0){
            window.alert("No Internet Connection Detected!");
        }else if (jqXHR === 404) {
            window.alert("CALLBACK Error in Html Detected");
        }else{
            window.alert("Failed to Resolve Request:" + textStatus + "\n");
        }
    });
   }
}


//app model
//It will start executing when rest of our code is executed
var appViewModel= function(){
    function timeout(markr) {
            marker.setAnimation(null);
        }
        var self = this;
        this.placeList = ko.observableArray([]);
        for (var j = 0; j < locs.length; j++) {
            self.placeList.push(locs[j]);
        }
        for (var i = 0; i < locs.length; i++) {
            console.log(i);
            self.placeList()[i].markr = marks[i];
        }
        this.CurrentPlace = function(LocClicked) {
            var marker;
            for (var i = 0; i < self.placeList().length; i++) {
                var id = self.placeList()[i].id;
                if (LocClicked.id == id) {
                    this.currentLocation = self.placeList()[i];
                    marker = markers[self.placeList()[i].id];
                }
            }
            if (!marker) alert('Something went wrong!');
            else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                // open an infoWindow when either a location is selected from
                // the list view or its map marker is selected directly.
                google.maps.event.trigger(marker, 'click');
            }
        };
        this.search = ko.observable('');
        this.TextSearch = function(value) {
            console.log(value);
            textSearchPlaces(value);
        };

        this.searchedLocation = ko.observable('');


        this.Filter = function(value) {
            self.placeList.removeAll();
            for (var i = 0; i < locs.length; i++) {
                var searchQuery = locs[i].title.toLowerCase();
                // find the starting match in every location
                if (searchQuery.indexOf(value.toLowerCase()) >= 0) {
                    self.placeList.push(locs[i]);
                }
            }
        };

        this.FilterForMarkers = function(value) {
            for (var i in locs) {
                var temp = marks[i];
                if (temp.setMap(this.map) !== null) {
                    temp.setMap(null);
                }
                var searchQuery = temp.title.toLowerCase();
                if (searchQuery.indexOf(value.toLowerCase()) >= 0) {
                    temp.setMap(map);
                }
            }
        };
        this.searchedLocation.subscribe(this.Filter);
        this.searchedLocation.subscribe(this.FilterForMarkers);
        this.search.subscribe(this.TextSearch);
};
    //binding
    ko.applyBindings(new appViewModel());
