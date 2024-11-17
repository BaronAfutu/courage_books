$(document).ready(async function () {
    "use strict";
    let books = [];


    const previewBookList = (containerID) => {
        const bookList = document.getElementById(containerID);
        bookList.innerHTML = "";

        books.forEach((book, index) => {
            let stars = '';
            for(let i=0;i<parseInt(book.rating.averageRating);i++){
                stars+='<i class="fas fa-star"></i>';
            }
            
            let bookContainer = document.createElement('div');
            bookContainer.className = 'col-md-6 col-lg-3 col-xxl-2';
            // bookContainer.innerHTML = `<a href="/user/book/${book.slug}" class="card library-book-card text-white">
            bookContainer.innerHTML = `<a href="/user/books/${book._id}/${book.slug}" class="card library-book-card text-white">
                            <!-- Book Cover Image -->
                            <img src="${book.coverImageUrl}" class="card-img"
                                alt="${book.title}">
                            <!-- Overlay Content -->
                            <div class="card-img-overlay d-flex flex-column justify-content-end p-0 pb-2">
                                <div class=" library-book-card-title w-100 p-3 text-center">
                                    <h5 class="card-title">${book.title}</h5>
                                </div>
                            </div>
                        </a>`;

            bookList.appendChild(bookContainer);

        });
    }

    const userId = $("#user").val();
    let user = null;
    try {
        user = await request(`/api/v1/users/${userId}`);
        books = user.books;
    } catch (error) {
        console.log(error);
        showAlert('warn','Could not load books. Refresh Page!!!');
    }
    previewBookList('bookList');
    
    $("#bookList").on('click', ".cart", async function () {
        let response = await addToCart($(this).data('id'))
        // console.log(response);
    });
    
});