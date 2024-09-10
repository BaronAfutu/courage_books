$(document).ready(function () {
    "use strict";
    let ratingIsSet = false;

    $('.star').hover(function () {
        // over
        if(ratingIsSet) return;
        const rating = $(this).data('value');
        $('.star').each(function () {
            if ($(this).data('value') <= rating) {
                $(this).addClass('text-warning');
            } else {
                $(this).removeClass('text-warning');
            }
        });
    }, function () {
        // out
        if(ratingIsSet) return;
        $('.star').removeClass('text-warning');
    }
    );

    $('.star').on('click', function() {
        const rating = $(this).data('value');
        ratingIsSet = true;
        $('.star').each(function() {
            if ($(this).data('value') <= rating) {
                $(this).addClass('text-warning');
            } else {
                $(this).removeClass('text-warning');
            }
        });
    });




    document.getElementById('paginationMsg').textContent = `Showing ${1}–${16} of ${20} results`;


   // Delegated event handlers have the advantage that they can
    // process events from descendant elements that are added to the document at a later time. 
    // $( "#dataTable tbody" ).on( "click", "tr", function() { //delegation
    //     console.log( $( this ).text() );
    //   });
});