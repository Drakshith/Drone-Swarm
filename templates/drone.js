// Initialize the map
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 }, // Default to a center point
        zoom: 10, // Adjust the zoom level as needed
    });

    // Create a geocoder object
    const geocoder = new google.maps.Geocoder();

    // Show the search form and hide the map initially
    document.getElementById('searchForm').style.display = 'block';
    document.getElementById('mapContainer').style.display = 'none';

    // Add a click event listener to the "Find Location" button
    document.getElementById('findLocation').addEventListener('click', function () {
        const locationInput = document.getElementById('locationInput').value;

        if (locationInput.trim() === '') {
            alert('Please enter a city.');
            return;
        }

        // Use the geocoder to get the latitude and longitude of the location
        geocoder.geocode({ address: locationInput }, function (results, status) {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;

                // Set the map center to the location
                map.setCenter(location);

                // Create a marker for the location
                new google.maps.Marker({
                    map: map,
                    position: location,
                    title: locationInput,
                });

                // Hide the search form and show the map
                document.getElementById('searchForm').style.display = 'none';
                document.getElementById('mapContainer').style.display = 'block';
            } else {
                alert('Location not found');
            }
        });
    });

    // Add a click event listener to the "Back to Search" button
    document.getElementById('backToSearch').addEventListener('click', function () {
        // Show the search form and hide the map
        document.getElementById('searchForm').style.display = 'block';
        document.getElementById('mapContainer').style.display = 'none';
    });
}
