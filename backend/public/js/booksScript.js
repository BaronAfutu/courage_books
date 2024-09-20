const getBooks = async () => {
    const books = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(BOOKS);
        }, 1000);
    });
    return books;

}


$(document).ready(async function () {
    "use strict";
    let ratingIsSet = false;
    let pageNumber = 1;
    let booksPerPage = 16;

    $('.star').hover(function () {
        // over
        if (ratingIsSet) return;
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
        if (ratingIsSet) return;
        $('.star').removeClass('text-warning');
    }
    );

    $('.star').on('click', function () {
        const rating = $(this).data('value');
        ratingIsSet = true;
        $('.star').each(function () {
            if ($(this).data('value') <= rating) {
                $(this).addClass('text-warning');
            } else {
                $(this).removeClass('text-warning');
            }
        });
    });

    const previewBooks = (containerID, books, pageNumber, limit) => {
        const bookList = document.getElementById(containerID);
        bookList.replaceChildren([]);
        const startIndex = (pageNumber - 1) * limit;
        const endIndex = Math.min(pageNumber * limit,books.length);

        for (let index = startIndex; index < endIndex; index++) {
            const book = books[index];
            const isLiked = book.categories.indexOf("Internet") > -1;
            const rating = Math.min(Math.round((book.pageCount * 5) / 500), 5);

            let bookContainer = document.createElement('div');
            bookContainer.className = 'col-6 col-md-3';

            let coverImageHolder = document.createElement('div');
            coverImageHolder.className = 'position-relative';
            coverImageHolder.innerHTML = `<div class="position-absolute w-100 d-flex justify-content-between">
                                    <span class="fa fa-heart fa-2x p-2 rounded-circle ${isLiked ? 'text-danger' : 'text-light'} shadow m-1"></span>
                                    <span
                                        class="fa fa-cart-arrow-down fa-2x p-2 rounded-circle text-light shadow"></span>
                                </div>
                                <img src="${book.thumbnailUrl}"
                                    alt="bookcover" class="img-fluid w-100 object-fit-cover rounded-3">`;

            const title = document.createElement('div');
            title.textContent = book.title;

            let stars = document.createElement('div');
            for (let i = 0; i < rating; i++) {
                let star = document.createElement('i');
                star.className = 'fa fa-star fa-sm text-warning';
                star.dataset.value = i + 1;
                stars.appendChild(star);
            }

            let price = document.createElement('div');
            price.textContent = `GH¢ ${book.pageCount}`;

            bookContainer.appendChild(coverImageHolder);
            bookContainer.appendChild(title);
            bookContainer.appendChild(stars);
            bookContainer.appendChild(price);

            // bookContainer.className = ''; // Add a class for styling
            // bookContainer.innerHTML = ``;

            bookList.appendChild(bookContainer);
        };
    }

    const setPaginationInfo = (pageNumber, limit, bookCount) => {
        const startIndex = (pageNumber - 1) * limit + 1;
        const endIndex = Math.min(pageNumber * limit,bookCount);
        const startPageNumber = Math.max(1, pageNumber - 1);
        const endPageNumber = Math.min(startPageNumber + 2, Math.ceil(bookCount / limit));

        document.getElementById('paginationMsg').textContent = `Showing ${startIndex}–${endIndex} of ${bookCount} results`;

        let paginationContainer = document.getElementById('pagination');
        paginationContainer.replaceChildren([]);

        if (pageNumber > 1) {
            let startArrow = document.createElement('div');
            startArrow.className = "text-dark rounded-circle pagination-number fa fa-arrow-left";
            startArrow.dataset.value = 1;
            paginationContainer.appendChild(startArrow);
        }
        for (let i = startPageNumber; i <= endPageNumber; i++) {
            let pageNumberDiv = document.createElement('div');
            pageNumberDiv.className = (i == pageNumber) ? 'text-light bg-success rounded-circle pagination-number' : 'text-dark rounded-circle pagination-number';
            pageNumberDiv.textContent = i;
            pageNumberDiv.dataset.value = i;
            paginationContainer.appendChild(pageNumberDiv)
        }
        let endArrow = document.createElement('div');
        endArrow.className = "text-dark rounded-circle pagination-number fa fa-arrow-right";
        endArrow.dataset.value = Math.ceil(bookCount / limit);
        paginationContainer.appendChild(endArrow);
    }





    const books = await getBooks();
    // $('.bs-loader').html('');
    previewBooks('bookList', books, pageNumber, booksPerPage);
    setPaginationInfo(pageNumber, booksPerPage, books.length);
    $('#pagination').on('click', '.pagination-number', function (e) {
        e.preventDefault();
        if (pageNumber == $(this).attr('data-value')) return;
        pageNumber = $(this).attr('data-value');
        setPaginationInfo(pageNumber, booksPerPage, books.length);
        previewBooks('bookList', books, pageNumber, booksPerPage);
    })
    // Delegated event handlers have the advantage that they can
    // process events from descendant elements that are added to the document at a later time. 
    // $( "#dataTable tbody" ).on( "click", "tr", function() { //delegation
    //     console.log( $( this ).text() );
    //   });
});