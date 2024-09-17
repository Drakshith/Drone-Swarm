// Step1 : Intialization and Setup the markers

var mapOptions;
var map;

var coordinates = []
let new_coordinates = []
let lastElement

var geofenceCoordinates = []; // Array to store geofence coordinates
var markerCoordinates = [];  //

function InitMap() {
    var location = new google.maps.LatLng(28.620585, 77.228609)
    mapOptions = {
        zoom: 12,
        center: location,
        mapTypeId: google.maps.MapTypeId.RoadMap
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)


    // Step 2 : Setup the Drawing Tool :



    var all_overlays = [];
    var selectedShape;
    var drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        //drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                //google.maps.drawing.OverlayType.MARKER,   // marker Point
               // google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,   // dot points
                //google.maps.drawing.OverlayType.RECTANGLE
            ]
        },
        markerOptions: {
            //icon: 'images/beachflag.png'
        },
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.2,
            strokeWeight: 3,
            clickable: false,
            editable: true,
            zIndex: 1
        },
        polygonOptions: {
            clickable: true,
            draggable: false,
            editable: true,
            // fillColor: '#ffff00',
            fillColor: '#ADFF2F',
            fillOpacity: 0.5,

        },
        rectangleOptions: {
            clickable: true,
            draggable: true,
            editable: true,
            fillColor: '#ffff00',
            fillOpacity: 0.5,
        }
    });


    // Step 3: Shape Selection And Deletion: 


    function clearSelection() {
        if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
        }
    }
    //to disable drawing tools
    function stopDrawing() {
        drawingManager.setMap(null);
    }

    function setSelection(shape) {
        clearSelection();
        stopDrawing()
        selectedShape = shape;
        shape.setEditable(true);
    }

    function deleteSelectedShape() {
        if (selectedShape) {
            selectedShape.setMap(null);
            drawingManager.setMap(map);
            coordinates.splice(0, coordinates.length)
            document.getElementById('info').innerHTML = ""
        }
    }


    // Step 4: customize Drawing tools: 


    function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Select to delete the shape';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Delete Selected Area';
        controlUI.appendChild(controlText);

        //to delete the polygon
        controlUI.addEventListener('click', function () {
            deleteSelectedShape();
        });
    }

    drawingManager.setMap(map);



    // Step 5 : Polygon Cordinates Contronling


    var getPolygonCoords = function (newShape) {

        coordinates.splice(0, coordinates.length)

        var len = newShape.getPath().getLength();

        for (var i = 0; i < len; i++) {
            coordinates.push(newShape.getPath().getAt(i).toUrlValue(6))
        }
        document.getElementById('info').innerHTML = coordinates
       
       
    }


    // Step 6 : Event Listener : 

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (event) {
        event.getPath().getLength();
        google.maps.event.addListener(event, "dragend", getPolygonCoords(event));

        google.maps.event.addListener(event.getPath(), 'insert_at', function () {
            getPolygonCoords(event)
            
        });

        google.maps.event.addListener(event.getPath(), 'set_at', function () {
            getPolygonCoords(event)
        })
    })

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        all_overlays.push(event);
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
            drawingManager.setDrawingMode(null);

            var newShape = event.overlay;
            newShape.type = event.type;
            google.maps.event.addListener(newShape, 'click', function () {
                setSelection(newShape);
            });
            setSelection(newShape);
        }
    })

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

    // Step 7 : marker Control ;

    // Define an array to store markers

    // Global variables
    var mapOptions;
    var map;
    var markers = []; // Array to store markers


    // ... (your existing code for initializing the map)

    // Function to add a marker on the map
    function addMarker(event) {
        if (markers.length < 5) {
            var marker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                draggable: true
            });
            markers.push(marker);
            updateMarkerPositions();
        } else {
            alert("You can only add up to 5 markers.");
        }
    }

    // Function to delete an individual marker
    function deleteMarker(index) {
        if (index >= 0 && index < markers.length) {
            markers[index].setMap(null);
            markers.splice(index, 1);
            updateMarkerPositions();
        }
    }

    // Function to delete all markers from the map
    function deleteAllMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        updateMarkerPositions();
    }

    // Function to update the marker positions displayed in the info div
    function updateMarkerPositions() {
        var positions = "";
        for (var i = 0; i < markers.length; i++) {
            positions += (i + 1) + ': lon: ' + markers[i].getPosition().lng().toFixed(6) + ', lat: ' + markers[i].getPosition().lat().toFixed(6) + '<br>';
        }
        document.getElementById('info').innerHTML = positions;
    
        
    }
    // Add event listeners
    map.addListener('click', addMarker);

    document.getElementById('delete-all-button').addEventListener('click', deleteAllMarkers);

    // Example: Add event listeners to delete individual markers
    for (var i = 0; i < 5; i++) {
        document.getElementById('delete-marker-' + (i + 1)).addEventListener('click', function (index) {
            return function () {
                deleteMarker(index);
            };
        }(i));
    }


    // Function to get and store geofence (polygon) coordinates
    function getPolygonCoords(polygon) {
    geofenceCoordinates = [];
    var len = polygon.getPath().getLength();
    for (var i = 0; i < len; i++) {
        var latLng = polygon.getPath().getAt(i);
        geofenceCoordinates.push(latLng);
     }
    displayPolygonCoords(geofenceCoordinates);
    }
    
    

}









InitMap()