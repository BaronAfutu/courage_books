const request = (url, method = "GET", data = {}) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: (method == "POST") ? JSON.stringify(data) : data,
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