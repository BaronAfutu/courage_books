$(document).ready(async function () {
    "use strict";
    let books = [];

    $('#prevPage').on('click', function() {
        alert("Previous page feature is not implemented in this example.");
    });

    // Handle "Next Page" button click
    $('#nextPage').on('click', function() {
        alert("Next page feature is not implemented in this example.");
    });

    // Handle "Fullscreen" button click
    $('#fullscreenToggle').on('click', function() {
        const pdfReader = document.getElementById("pdfReader");
        if (pdfReader.requestFullscreen) {
            pdfReader.requestFullscreen();
        } else if (pdfReader.webkitRequestFullscreen) { /* Safari */
            pdfReader.webkitRequestFullscreen();
        } else if (pdfReader.msRequestFullscreen) { /* IE11 */
            pdfReader.msRequestFullscreen();
        }
    });
});