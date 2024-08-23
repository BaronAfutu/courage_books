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

    const carouselBookList = (containerID, limit = 0) => { // TODO still working on
        const bookList = document.getElementById(containerID);
        books.forEach((book, index) => {
            if (index >= limit) return;
            let bookContainer = document.createElement('div');
            bookContainer.className = 'owl-carousel-info-wrap item'; // Add a class for styling
            bookContainer.innerHTML = `<img src="${book.thumbnailUrl}" class="owl-carousel-image img-fluid" alt="">
                            <div class="owl-carousel-info">
                                <h6 class="mb-2">
                                    ${book.title}
                                    ${book.shortDescription ? '<span class="fa fa-check-circle fa-sm text-primary"></span>' : ""}
                                </h6>
                                ${book.categories.map(category =>
                `<span class="badge">${category}</span>`)
                    .join("")}
                            </div>

                            <div class="social-share">
                                <ul class="social-icon">
                                    <li class="social-icon-item">
                                        <a href="#" data-bookid="${book.isbn}" class="social-icon-link fa fa-heart"></a>
                                    </li>

                                    <li class="social-icon-item">
                                        <a href="#" data-bookid="${book.isbn}" class="social-icon-link fa fa-cart-arrow-down"></a>
                                    </li>
                                </ul>
                            </div>`;

            bookList.appendChild(bookContainer);
        })
    }

    const previewBookList = (containerID, limit = 0) => {
        const bookList = document.getElementById(containerID);
        // console.log(books.length, books[0].title)

        books.forEach((book, index) => {
            if (index >= limit) return; // It will still go through all the books

            let bookContainer = document.createElement('div');
            bookContainer.innerHTML = `<div class="d-flex">
                        <img src="${book.thumbnailUrl}" alt=""
                        height="100" class="d-inline-block align-text-top rounded" />
                        <div class="m-2 w-100">
                            <h3>${book.title}</h3>
                            <div class="d-flex justify-content-between">
                                <div class="text-secondary">Pages: ${book.pageCount}</div>
                                <div class="text-end">
                                    ${book.categories.map(category =>
                `<span class="p-2 mx-1 bg-primary-subtle rounded-pill">${category}</span>`)
                    .join("")}
                                </div>
                            </div>
                            </div>
                        </div>
                        <p>Description: ${book.shortDescription}</p>`;
            bookContainer.className = 'shadow-sm my-3 px-2 py-1 rounded bg-info-subtle'; // Add a class for styling

            bookList.appendChild(bookContainer);
        });

        $('.owl-carousel').owlCarousel({
            center: true,
            loop: true,
            margin: 30,
            autoplay: true,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 2,
                },
                767: {
                    items: 3,
                },
                1200: {
                    items: 4,
                }
            }
        });
    }

    const previewFeaturedBook = (containerID) => {
        let featuredBook = books[0];
        $(`#${containerID} img`).attr("src", featuredBook.thumbnailUrl);
        $(`#${containerID} .loader-img`).removeClass("loader-img");
        $(`#${containerID} #featuredTitle`).html(featuredBook.title);
        $(`#${containerID} #featuredTags`).html(featuredBook.categories.map(category =>
            `<span class="p-2 mx-1 bg-primary-subtle rounded-pill">${category}</span>`
        ).join(""));
        $(`#${containerID} #featuredDescription`).html(featuredBook.shortDescription);
    }

    const previewNavBooksList = (containerID, limit = 4) => {
        const bookList = document.getElementById(containerID);
        // console.log(books.length, books[0].title)

        books.forEach((book, index) => {
            if (index >= limit) return; // It will still go through all the books

            let bookContainer = document.createElement('li');
            let link = document.createElement('a');
            link.className = 'dropdown-item';
            link.href = `${book.title}.html`;
            link.textContent = book.title;
            bookContainer.appendChild(link);

            // bookContainer.className = ''; // Add a class for styling
            // bookContainer.innerHTML = ``;

            bookList.appendChild(bookContainer);
        });
    }

    const previewFeaturedSeries = (containerID, limit = 5) => {
        const bookList = document.getElementById(containerID);
        // console.log(books.length, books[0].title)

        /*
        <div class="col-3">
                        <a href="" class="w-100">
                            <div class="shadow w-100">
                                <img src="https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson.jpg"
                                    class="img-fluid rounded-2 w-100" alt="Featured Book 1">
                            </div>
                            <button class="btn btn-primary my-3">Read More</button>
                        </a>
                    </div>
        */

        books.forEach((book, index) => {
            if (index >= limit) return; // It will still go through all the books

            let bookContainer = document.createElement('div');
            bookContainer.className = 'col-6 col-md-4 my-4';
            
            let link = document.createElement('a');
            link.className = 'w-100';
            link.href = `${book.title}.html`;

            let coverPageCard = document.createElement('div');
            coverPageCard.className = 'shadow w-100';

            let coverPage = document.createElement('img');
            coverPage.src = book.thumbnailUrl;
            coverPage.className='img-fluid rounded-2 w-100';
            coverPage.alt = book.title;

            coverPageCard.appendChild(coverPage);

            let readMoreButton = document.createElement('button');
            readMoreButton.className = 'btn btn-outline-light rounded-pill my-3';
            readMoreButton.textContent = 'Read More';

            link.appendChild(coverPageCard);
            link.appendChild(readMoreButton);
            
            bookContainer.appendChild(link);

            // bookContainer.className = ''; // Add a class for styling
            // bookContainer.innerHTML = ``;

            bookList.appendChild(bookContainer);
        });
    }


    // $(window).scroll(function (e) {
    //     if ($(document).scrollTop() > 10) {
    //       $('.navbar').addClass("navbar-scroll");
    //     } else {
    //       $('.navbar').removeClass("navbar-scroll");
    //     }
    //   });





    const books = await getBooks();
    $(".loader-img").removeClass("loader-img");


    previewNavBooksList('navbarBooksListing')
    carouselBookList('carouselBookListing', 6);
    previewBookList('bookList', 10);
    previewFeaturedSeries('featuredSeries', 5);
    previewFeaturedBook("featuredBook");

    $('#searchBooks').typeahead({
        source: books,
        displayField: 'title',
        valueField: 'isbn',
        // suggestion: '<div><strong>{{title}}</strong> – {{title}}</div>',
        onSelect: (item) => { console.log(item) }
    });
});