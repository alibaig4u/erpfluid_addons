// Copyright (c) 2019, Frappe Technologies and contributors
// For license information, please see license.txt
var map = null;
var mapMarker=[]
var directionsService=null
var directionsRenderer=null
frappe.ui.form.on('Trip', {
    onload: function(frm) {
        window.onerror = function(messageOrEvent, source, lineno, colno, error) {
            frappe.call({
                method: "erpfluid_addons.erpfluid_addons.doctype.trip.trip.log_error",
                args: {
                    messageOrEvent: messageOrEvent,
                    source: source,
                    lineno: lineno,
                    error: error,
                    file: "Trip"
                },
                callback(resp) {
                    //todo
                }
            });
        }
        frappe.model.set_value(frm.doc.doctype, frm.doc.name, "user_detail", frappe.session.user);
        cur_frm.refresh_field("user_detail");
        frappe.model.set_value(frm.doc.doctype, frm.doc.name, "date", frappe.datetime.get_today());
        cur_frm.refresh_field("date");

    },
    refresh: function(frm) {
        console.log('refreshing')
        var destAddress = new google.maps.LatLng(33.7294, 74.0931);
        //initMap(originAddress, destAddress);
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position){
            var originAddress = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: originAddress,
        });
        // var marker = new google.maps.Marker({
        //     position: originAddress,
        //     map: map
        // });
        console.log(map)
        frappe.call({
            method: "erpfluid_addons.erpfluid_addons.doctype.trip.trip.get_user_data",
            args: {
                form:cur_frm.doc.name
            },
            callback(response) {
                console.log(response.message)
                var point = []
                response.message.forEach(function(item) {
                    point.push({ 
                        location: item.lat+', '+ item.long,
                        stopover: true
                    })
                    // var marker2 = new google.maps.Marker({
                    //     position: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.long)),
                    //     map: map,
                    //     title: item.datetime
                    // });
                   
                })
                //point.push({ 'lat': position.coords.latitude, 'lng': position.coords.longitude })
                if(point.length >1){
                    directionsService = new google.maps.DirectionsService;
                    directionsRenderer = new google.maps.DirectionsRenderer
                    directionsRenderer.setMap(map);
                    var destin=position.coords.latitude.toString()+', '+ position.coords.longitude.toString()
                    console.log(point)
                    directionsService.route({
                        origin: point[0].location,
                        destination: point[(point.length)-1].location,
                        // waypoints: point,
                        // optimizeWaypoints: true,
                        travelMode: 'DRIVING'
                    }, function(response, status) {
                        if (status === 'OK') {
                        directionsRenderer.setDirections(response);
                        // var marker2 = new google.maps.Marker({
                        //         position: new google.maps.LatLng(point[0].location.split(', ')[0],point[0].location.split(', ')[1]),
                        //         map: map,
                        //         title: 'start Point',
                        //         icon:"https://demo.tboss.info/files/7f03b023-5db4-4526-a457-2954bf476c90.jfif"
                        //     });
                         }
                        })
                }

                // var geodesicPoly = null
                // geodesicPoly = new google.maps.Polyline({
                //     strokeColor: '#CC0099',
                //     strokeOpacity: 1.0,
                //     strokeWeight: 3,
                //     geodesic: true,
                //     map: map
                // });
                // // var paths=[originAddress,destAddress];
                // console.log(point)
                // geodesicPoly.setPath(point);
            }
        });
    });
}

        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(showPosition);
        // } else {
        //     console.log("Geolocation is not supported by this browser.");
        // }
       

    },
    show_history:function(frm){
        
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 11
            });
            directionsService = new google.maps.DirectionsService;
            directionsRenderer = new google.maps.DirectionsRenderer
            directionsRenderer.setMap(map);
        
        frappe.call({
            method: "erpfluid_addons.erpfluid_addons.doctype.trip.trip.get_user_data",
            args: {
                form:cur_frm.doc.name
            },
            callback(response) {
                console.log(response.message)
                var point = []
                response.message.forEach(function(item) {
                    point.push({ 
                        location: item.lat+', '+ item.long,
                        stopover: true
                    })
                    // var marker2 = new google.maps.Marker({
                    //     position: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.long)),
                    //     map: map,
                    //     title: item.datetime
                    // });
                   
                })
                //point.push({ 'lat': position.coords.latitude, 'lng': position.coords.longitude })
                if(point.length >1){
                    directionsService = new google.maps.DirectionsService;
                    directionsRenderer = new google.maps.DirectionsRenderer;
                    directionsRenderer.setMap(map);
                    //var destin=position.coords.latitude.toString()+', '+ position.coords.longitude.toString()
                    console.log(point)
                    var way_point = point
                    if (point.length >10){
                        way_point=[]
                        way_point.push({location:point[1].location,stopover:true})
                        way_point.push({location:point[2].location,stopover:true})
                        way_point.push({location:point[3].location,stopover:true})
                        way_point.push({location:point[(parseInt(point.length)/2)-2].location,stopover:true})
                        way_point.push({location:point[(parseInt(point.length)/2)-1].location,stopover:true})
                        way_point.push({location:point[(parseInt(point.length)/2)].location,stopover:true})
                        way_point.push({location:point[(parseInt(point.length)/2)+1].location,stopover:true})
                        way_point.push({location:point[parseInt(point.length)-3].location,stopover:true})
                        way_point.push({location:point[parseInt(point.length)-2].location,stopover:true})
                        way_point.push({location:point[parseInt(point.length)-1].location,stopover:true})
                    }
                    console.log("________________________________________")
                    console.log(way_point)
                    directionsService.route({
                        origin: point[0].location,
                        destination: point[(point.length)-1].location,
                        waypoints: way_point,//point.slice(0,(point.length)),
                         //optimizeWaypoints: true,
                        travelMode: 'DRIVING'
                    }, function(response, status) {
                        if (status === 'OK') {
                            console.log(response)
                        directionsRenderer.setDirections(response);
                        // console.log(map.markers)
                        // console.log(map.getMarkers())
                        }
                        })
                }

                // var geodesicPoly = null
                // geodesicPoly = new google.maps.Polyline({
                //     strokeColor: '#CC0099',
                //     strokeOpacity: 1.0,
                //     strokeWeight: 3,
                //     geodesic: true,
                //     map: map
                // });
                // // var paths=[originAddress,destAddress];
                // console.log(point)
                // geodesicPoly.setPath(point);
            }
        });
    },
    stop: function(frm) {
        var newDate = new Date();
        console.log(newDate)
        var datetime = newDate.today() + " " + newDate.timeNow();
        frappe.model.set_value(frm.doc.doctype, frm.doc.name, "stop_time", datetime);
        cur_frm.refresh_field("stop_time");
        frappe.model.set_value(frm.doc.doctype, frm.doc.name, "stop_time_hidden", newDate);
        cur_frm.refresh_field("stop_time_hidden");
        var d1= new Date(frm.doc.start_time_hidden)
        var d2 = new Date(frm.doc.stop_time_hidden)
        console.log(d1)
        console.log(d2)
        var diff= Math.abs(d2-d1)
        //var diff = new Date(diff);
        console.log(convertMS(diff))
        var ttm = convertMS(diff)
        frappe.model.set_value(frm.doc.doctype, frm.doc.name, "time_diff", ttm.day+":"+ttm.hour+":"+ttm.minute+":"+ttm.seconds);
        cur_frm.refresh_field("time_diff");
        frappe.model.set_value(frm.doc.doctype, frm.doc.name, "flag", 'stoped');
        cur_frm.refresh_field("flag");
        navigator.geolocation.getCurrentPosition(function (position){
            var geocoder = new google.maps.Geocoder;
            var infowindow = new google.maps.InfoWindow;
            var latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
            geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                map.setZoom(8); 
                // var marker = new google.maps.Marker({
                //     position: latlng,
                //     map: map
                // });
                frappe.model.set_value(cur_frm.doc.doctype, cur_frm.doc.name, "destination",results[0].formatted_address );
                cur_frm.refresh_field("destination");
                var child = cur_frm.add_child("trip_details");
                frappe.model.set_value(child.doctype, child.name, "start_point", frm.doc.origin);
                frappe.model.set_value(child.doctype, child.name, "stop_point", frm.doc.destination);
                frappe.model.set_value(child.doctype, child.name, "start_time", frm.doc.start_time);
                frappe.model.set_value(child.doctype, child.name, "stop_time", frm.doc.stop_time);
                frappe.model.set_value(child.doctype, child.name, "total_time", frm.doc.time_diff);
                cur_frm.refresh_field("trip_details");
                // infowindow.setContent(results[0].formatted_address);
                // infowindow.open(map, marker);
                cur_frm.save();
                } else {
                window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
            });

        });
        
        

    },
    start: function(frm) {
        console.log(frm.doc)
        if(frm.doc.__unsaved){
            frappe.msgprint("Please save the form first")
            return false
        }
        var newDate = new Date();
        var datetime = newDate.today() + " " + newDate.timeNow();
        frappe.model.set_value(frm.doc.doctype, frm.doc.name, "start_time", datetime);
            cur_frm.refresh_field("start_time");
            frappe.model.set_value(frm.doc.doctype, frm.doc.name, "start_time_hidden", newDate);
            cur_frm.refresh_field("start_time_hidden");
        if (navigator.geolocation) {
            frappe.model.set_value(frm.doc.doctype, frm.doc.name, "flag", 'started');
            cur_frm.refresh_field("flag");
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

    }
});

function showPosition(position) {
    // x.innerHTML = "Latitude: " + position.coords.latitude + 
	// "<br>Longitude: " + position.coords.longitude;
	
    var originAddress = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var destAddress = new google.maps.LatLng(33.7294, 73.0931);
    if (!map) {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: originAddress,
        });
        directionsService = new google.maps.DirectionsService;
        directionsRenderer = new google.maps.DirectionsRenderer
        //({
        //     suppressMarkers: false
        //   });
        directionsRenderer.setMap(map);
	}
	if(cur_frm.doc.flag=="started"){
		var geocoder = new google.maps.Geocoder;
		var infowindow = new google.maps.InfoWindow;
		var latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              //map.setZoom(8);
            //   var marker = new google.maps.Marker({
            //     position: latlng,
            //     map: map
			//   });
			  frappe.model.set_value(cur_frm.doc.doctype, cur_frm.doc.name, "origin",results[0].formatted_address );
              cur_frm.refresh_field("origin");
            //   infowindow.setContent(results[0].formatted_address);
            //   infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });

	}
    var count = 0
    initMap(position.coords.latitude, position.coords.longitude, map, count);
}

function initMap(lat, lng, map, count) {
    //console.log(map)
    var originAddress = new google.maps.LatLng(lat, lng)
     if (!directionsService || !directionsRenderer){
        directionsService = new google.maps.DirectionsService;
        directionsRenderer = new google.maps.DirectionsRenderer;
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: new google.maps.LatLng(lat, lng),
        });
        directionsRenderer.setMap(map); 
     }
    //console.log(originAddress)
	// map = new google.maps.Map(document.getElementById('map'), {
    //     zoom: 11,
    //     center: originAddress,
    // });
    frappe.call({
        method: "erpfluid_addons.erpfluid_addons.doctype.trip.trip.update_user_data",
        args: {
            form:cur_frm.doc.name,
            lat: lat,
            long: lng
        },
        callback(response) {
            console.log(response.message)
            var point = []
            response.message.forEach(function(item) {
                point.push({ 
                    location: item.lat+', '+ item.long,
                    stopover: true
                })
                // var marker2 = new google.maps.Marker({
                //     position: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.long)),
                //     map: map,
                //     title: item.datetime
                // });
            })
            if (point.length >1){
               
                //var destin=position.coords.latitude.toString()+', '+ position.coords.longitude.toString()
                //console.log(point)
                directionsService.route({
                    origin: point[0].location,
                    destination: point[(point.length)-1].location,
                    // waypoints: point,
                    // optimizeWaypoints: true,
                    travelMode: 'DRIVING'
                  }, function(response, status) {
                    if (status === 'OK') {
                        //console.log(response)
                      directionsRenderer.setDirections(response);
                    }
                    })
                    
            }
            // var geodesicPoly = null
            // geodesicPoly = new google.maps.Polyline({
            //     strokeColor: '#CC0099',
            //     strokeOpacity: 1.0,
            //     strokeWeight: 3,
            //     geodesic: true,
            //     map: map
            // });
            // // var paths=[originAddress,destAddress];
            // console.log(point)
            // geodesicPoly.setPath(point);
            if (cur_frm.doc.flag == 'stoped' || !cur_frm.doc.flag) {
                return false;
            }
            count = count + (Math.random())
        setTimeout(function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    originAddress = null//+ Math.random()
                        //originAddress = new google.maps.LatLng(position.coords.latitude, position.coordconsole.log("Geolocation is not supported by this browser.")s.longitude+count);
                    initMap((position.coords.latitude), (position.coords.longitude), map, count)
                        //console.log((originAddress.lat).toString()+', '+(originAddress.lng).toString())
                });
            } else {
                //frappe/frappe/geo/doctype/trip/trip.js
            }

        }, 1000);
            

        }
	})
	
	


}
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

  function convertMS( milliseconds ) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}