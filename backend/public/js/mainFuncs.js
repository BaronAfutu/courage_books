const request = (url, method = "GET", data = {}) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: (method == "GET") ? data : JSON.stringify(data),
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + $('#token').val()); },
            success: function (response) {
                resolve(response)
            },
            error: function (xhr, status, error) {
                // console.log(xhr.responseText);
                // console.log(xhr.status); // =>Status code
                // console.log(xhr);
                // console.log(status); // =>error
                // console.log(error); // =>status code message
                // console.log(xhr.statusText); // =>status code message
                reject(xhr);
            }
        });
    })
}

const uploadRequest = (url, formData) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,  // Prevent jQuery from converting the data into a query string
            contentType: false,  // Set the content type to false, as jQuery will tell the browser to set it to multipart/form-data
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + $('#token').val()); },
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                reject(xhr.responseText);
            }
        });
    })
}

const getBooks = async () => {
    const books = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(BOOKS);
        }, 1000);
    });
    return books;
}

const carouselBookList = (books, containerID, limit = 0) => { // TODO still working on
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

const previewFeaturedBooks = (books, containerID) => {
    const bookList = document.getElementById(containerID);
    bookList.innerHTML = '';
    let featuredBook = books.filter((book) => {
        return book.featured || book.rating.averageRating > 4.5;
    });

    const numberOfFeatured = Math.min(3, featuredBook.length)

    for (let i = 0; i < numberOfFeatured; i++) {
        let bookContainer = document.createElement('div');
        bookContainer.className = "col-6 col-md-4";
        // bookContainer.textContent = "sf";
        bookContainer.innerHTML = `<div class="card book-card my-1 my-md-0">
        <img src="${featuredBook[i].coverImageUrl}" class="img-fluid object-fit-cover card-img-top" alt="Book 1">
        <div class="card-body">
          <h5 class="card-title">${featuredBook[i].title}</h5>
          <!-- <p class="card-text">${featuredBook[i].description}</p>-->
          <a href="/books/${featuredBook[i].category}/${featuredBook[i].slug}" class="btn btn-secondary">Learn More</a>
        </div>
      </div>`;
        bookList.appendChild(bookContainer);
    }
}

const previewNavBooksList = (books, containerID, limit = 4) => {
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

const previewFeaturedSeries = (books, bookscontainerID, limit = 5) => {
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
        coverPage.className = 'img-fluid rounded-2 w-100';
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

const showAlert = (type, message) => {
    switch (type) {
        case 'success':
            $("#successAlert").removeClass("d-none");
            $("#successAlert").addClass("show");
            $("#successMessage").text(message);
            setTimeout(() => {
                $("#successAlert").removeClass("show");
                $("#successAlert").addClass("d-none");
            }, 3000);
            break;
        case 'warn':
            $("#warningAlert").removeClass("d-none");
            $("#warningAlert").addClass("show");
            $("#warningMessage").text(message);
            setTimeout(() => {
                $("#warningAlert").removeClass("show");
                $("#warningAlert").addClass("d-none");
            }, 3000);
            break;
        default:
            break;
    }
}

const getCart = async () => {
    const token = $('#token').val();
    let cartItems = null;
    if (typeof token === 'string' && token != '') { //user is logged in, get from database
        try {
            cartItems = (await request('/api/v1/cart')).cart;
        } catch (error) {

        }
    } else {//get from localstorage
        try {
            cartItems = JSON.parse(localStorage.getItem("cart"));
        } catch (error) {
            cartItems = [];
        }
        // console.log('logged out')
    }
    if (typeof cartItems === 'undefined' || cartItems === null) {
        cartItems = [];
        localStorage.setItem("cart", JSON.stringify([]));
        // console.log("cartitems fixed")
    }
    $("#cartCount").text(cartItems.length);
}

const addToCart = async (bookId, quantity = 1) => {
    quantity = parseInt(quantity);
    const token = $('#token').val();
    let cartItems = [];
    if (typeof token === 'string' && token != '') { //user is logged in, get from database
        try {
            let response = await request('/api/v1/cart/', 'POST', { bookId, quantity });
            cartItems = response.cart;
        } catch (error) {
            console.log(error);
            showAlert("warn", "Could not Add Book to Cart.");
            return;
        }
    } else {//get from localstorage
        cartItems = JSON.parse(localStorage.getItem("cart"));
        let isItemInCart = false;
        for (let item of cartItems) {
            if (bookId === item.bookId) {
                item.quantity += quantity;
                isItemInCart = true;
                break;
            }
        }

        if (!isItemInCart) {
            cartItems.push({ bookId, quantity });
        }
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    $("#cartCount").text(cartItems.length);

    showAlert("success", "Book Added to Cart Successfully.");
}

const removeFromCart = async (bookId) => {
    const token = $('#token').val();
    let cartItems = [];
    if (typeof token === 'string' && token != '') { //user is logged in, get from database
        try {
            let response = await request('/api/v1/cart/', 'DELETE', { bookId });
            cartItems = response.cart;
        } catch (error) {
            console.log(error);
            showAlert("warn", "Could not Remove Book from Cart.");
            return cartItems;
        }
    } else {
        cartItems = JSON.parse(localStorage.getItem("cart"));
        cartItems = cartItems.filter(book => {
            return bookId !== book.bookId;
        })
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    $("#cartCount").text(cartItems.length);

    showAlert('success', 'Book Removed from Cart');

    return cartItems;
}

const makeFieldInvalid = (selector) => {
    if (!$(selector).hasClass('is-invalid')) {
        $(selector).removeClass('is-valid');
        $(selector).addClass('is-invalid');
    }
}

const makeFieldValid = (selector) => {
    if (!$(selector).hasClass('is-valid')) {
        $(selector).removeClass('is-invalid');
        $(selector).addClass('is-valid');
    }
}

$(document).ready(function () {
    getCart();
});