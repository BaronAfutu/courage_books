$(document).ready(async function () {
    "use strict";
    let books = [];
    let pageBook = {};

    const path = window.location.pathname.split('/');
    const bookIndex = path.indexOf('books')
    const bookCat = bookIndex > -1 ? path[bookIndex + 1] : '';
    const bookSlug = bookIndex > -1 ? path[bookIndex + 2] : '';
    // console.log(bookSlug);

    try {
        const bookResponse = await request(`/api/v1/books`, 'GET', { 'category': bookCat });
        books = bookResponse.books;

        for (let book of books) {
            if (book.slug == bookSlug) {
                pageBook = book;
                break;
            }
        }

        if (typeof pageBook.authors === 'undefined') {
            window.location.replace("/not-found");
        }

        books = books.filter((book) => {
            return book.slug != bookSlug;
        })
        // console.log(pageBook);

        // $("#bookImage").attr('src', pageBook.coverImageUrl);




        const containerID = "bookInformation";
        const bookInformationContainer = document.getElementById(containerID);

        const bookCover = document.createElement('div');
        bookCover.className = "col-md-6";
        bookCover.innerHTML = `<img src="${pageBook.coverImageUrl}" alt="${pageBook.title}"
                    class="img-fluid object-fit-contain rounded w-100" id="bookImage">`

        const bookDetails = document.createElement('div');
        bookDetails.className = "col-md-6";
        bookDetails.innerHTML = `<h1 class="mb-4 text-lavender-dark">${pageBook.title}</h1>
                    <!-- Book Details -->
                    <ul class="list-unstyled text-light">
                        <li class="my-1"><strong>Author:</strong> ${pageBook.authors[0]}</li>
                        <li class="my-1"><strong>Genre:</strong> ${pageBook.genres.join(", ")}</li>
                        <li class="my-1"><strong>Publisher:</strong> ${pageBook.publisher}</li>
                        <li class="my-1"><strong>Release Date:</strong> ${pageBook.publicationDate}</li>
                        <li class="my-1"><strong>Pages:</strong> ${pageBook.numberOfPages}</li>
                        <li class="my-1"><strong>ISBN:</strong> ${pageBook.isbn}</li>
                    </ul>

                    <!-- Price, Quantity, and Add to Cart -->
                    <p class="mt-4">
                        <strong class="h4 accent-color-bright">GHc ${pageBook.price}</strong>
                    </p>
                    <div class="d-flex align-items-center mb-4 text-light">
                        <label for="quantity" class="me-2">Quantity:</label>
                        <input type="number" id="quantity" name="quantity" class="form-control w-25 me-3" min="1"
                            value="1">
                        <button class="btn btn-primary cart" data-id="${pageBook._id}"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                    </div>

                    <!-- Share Options -->
                    <p class="mt-4 text-light">Share this book:</p>
                    <div class="d-flex">
                        <a href="#" class="btn btn-outline-light me-2" title="Share on Facebook"><i
                                class="fab fa-facebook-f"></i> Facebook</a>
                        <a href="#" class="btn btn-outline-light me-2" title="Share on Instagram"><i
                                class="fab fa-instagram"></i> Instagram</a>
                        <a href="#" class="btn btn-outline-light me-2" title="Share on X (formerly Twitter)"><i
                                class="fab fa-x-twitter"></i> X</a>
                        <a href="#" class="btn btn-outline-light" title="Share on LinkedIn"><i
                                class="fab fa-linkedin-in"></i> LinkedIn</a>
                    </div>`;

        const bookDescription = document.createElement('div');
        bookDescription.className = "col-md-12 pt-5";
        bookDescription.innerHTML = pageBook.description.split('\\n').map(paragraph => {
            return `<p class="featured-section-text">${paragraph}</p>`
        }).join(' ');

        bookInformationContainer.innerHTML = '';
        bookInformationContainer.appendChild(bookCover);
        bookInformationContainer.appendChild(bookDetails);
        bookInformationContainer.appendChild(bookDescription);




        const similarBooksContainer = document.getElementById('similarBooks');
        similarBooksContainer.innerHTML = '';

        const numberOfSimilarBooks = Math.min(4, books.length);
        for (let i = 0; i < numberOfSimilarBooks; i++) {
            const book = books[i];

            const similarBook = document.createElement('div');
            similarBook.className = "col-md-3";
            similarBook.innerHTML = `<div class="card book-card border-0 shadow-sm">
                        <img src="${book.coverImageUrl}" class="card-img-top" alt="${book.title}">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <a href="/books/${book.category}/${book.slug}" class="btn btn-outline-secondary">View Details</a>
                        </div>
                    </div>`;
            similarBooksContainer.appendChild(similarBook);
        }

        $("#bookInformation").on('click', ".cart", async function () {
            const qty = $("#quantity").val();
            let response = await addToCart($(this).data('id'), qty);
            // console.log(response);
        });



    } catch (error) {
        console.log(error)
        showAlert('Could retrieve the book. Reload the page to try again');
        // alert(error.responseJSON.errMsg || error.responseJSON.message)
    }

});