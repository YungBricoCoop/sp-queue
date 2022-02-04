let accessToken = "";

// Document has been loaded
$(document).ready(function () {
    // Helper Function to Extract Access Token for URL
    const getUrlParameter = (sParam) => {
        let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
            sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
            sParameterName,
            i;
        let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
        sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    // Get Access Token
    accessToken = getUrlParameter('access_token');

    // AUTHORIZE with Spotify (if needed)
    // *************** REPLACE THESE VALUES! *************************
    let client_id = '***';
    // Use the following site to convert your regular url to the encoded version:
    // https://www.url-encode-decode.com/
    let redirect_uri = '***'; // GitHub Pages URL or whatever your public url to this app is
    // *************** END *************************

    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=user-modify-playback-state`;
    // Don't authorize if we have an access token already
    if (accessToken == null || accessToken == "" || accessToken == undefined) {
        window.location.replace(redirect);
    }


}); // End of document.ready


function search() {
    //Get the value of the search box
    let raw_search_query = $('#searchBar').val();
    let search_query = encodeURI(raw_search_query);
    // Make Spotify API call
    // Note: We are using the track API endpoint.
    $.ajax({
        url: `https://api.spotify.com/v1/search?q=${search_query}&type=track`,
        type: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data) {
            $('#songs').empty();
            console.log(data);
            data.tracks.items.forEach(song => {
                $('#songs').append(`<div class="col">${song.name}</br><img src="${song.album.images[0].url}" onclick='addToQueue("${song.uri}")'></div>`);
            }
            );
        }
    }); // End of Spotify ajax call
}


function addSong(uri) {
    $.ajax({
        url: `https://api.spotify.com/v1/me/player/queue?uri=${uri}`,
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data) {
            console.log(data);

        }
    }); // End of Spotify ajax call
}