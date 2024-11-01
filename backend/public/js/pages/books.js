$(document).ready(async function () {
    "use strict";
    let books = [];




    // $(window).scroll(function (e) {
    //     if ($(document).scrollTop() > 10) {
    //       $('.navbar').addClass("navbar-scroll");
    //     } else {
    //       $('.navbar').removeClass("navbar-scroll");
    //     }
    //   });



    const previewBookList = (containerID, limit = 0) => {
        const bookList = document.getElementById(containerID);
        bookList.innerHTML = "";

        books.forEach((book, index) => {
            if (index >= limit) return; // It will still go through all the books
            let stars = '';
            for(let i=0;i<parseInt(book.rating.averageRating);i++){
                stars+='<i class="fas fa-star"></i>';
            }
            
            let bookContainer = document.createElement('div');
            bookContainer.className = 'col-md-3';
            bookContainer.innerHTML = `<div class="card book-card mb-4">
                            <img src="${book.coverImageUrl}" class="img-fluid object-fit-zoom card-img-top" alt="Book 1">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <!--<p>
                                    <span class="star-rating">
                                        ${stars}
                                    </span>
                                    <span class="text-muted">${book.rating.averageRating}</span>
                                </p>-->
                                <p class="card-text">Price: <strong>GHc ${book.price}</strong></p>
                                <a href="/books/${book.category}/${book.slug}" class="btn btn-secondary">Learn More</a>
                                <a href="#" class="btn btn-outline-secondary cart" data-id="${book._id}"><i class="fas fa-cart-plus"></i></a>
                            </div>
                        </div>
            `;

            bookList.appendChild(bookContainer);

        });
    }



    try {
        const booksResponse = await request('/api/v1/books/');
        books = booksResponse.books;
    } catch (error) {
        alert(error.responseJSON.errMsg || error.responseJSON.message)
    }

    previewBookList('bookList', 10);
    
    $("#bookList").on('click', ".cart", async function () {
        let response = await addToCart($(this).data('id'))
        // console.log(response);
    });
    // $(".loader-img").removeClass("loader-img");


    // previewNavBooksList('navbarBooksListing')
    // carouselBookList('carouselBookListing', 6);


    // $('#searchBooks').typeahead({
    //     source: books,
    //     displayField: 'title',
    //     valueField: 'isbn',
    //     // suggestion: '<div><strong>{{title}}</strong> – {{title}}</div>',
    //     onSelect: (item) => { console.log(item) }
    // });


    // $("#fileUpload").submit(async function (e) {
    //     e.preventDefault(); // Prevent the form from submitting via the browser

    //     let formData = new FormData();
    //     let fileInput = $('#bookCover')[0].files[0];
    //     if (!fileInput) {
    //         alert("Please select an image upload.");
    //         return false;
    //     }
    //     formData.append('bookCover', fileInput);

    //     let formData2 = new FormData();
    //     let fileInput2 = $('#bookFile')[0].files[0];
    //     if (!fileInput2) {
    //         alert("Please select a PDF file to upload.");
    //         return false;
    //     }
    //     formData2.append('bookFile',fileInput2);

    //     // try{
    //     //     let response = await request('http://localhost:3000/books/','POST');
    //     //     console.log(response);
    //     // }catch(error){
    //     //     console.log(error.responseText)
    //     // }

    //     // uploadRequest('http://localhost:3000/uploads/cover/66c74cdbf4dc26be1dab1142?slug=thebook', formData)
    //     //     .then(response => {
    //     //         console.log(response);
    //     //         // Response => Object { message: "Image uploaded successfully", fileName: "bookCover-1725209079725-thebook.png" }
    //     //     }).catch(error => {
    //     //         console.log(error)
    //     //         alert("Error")
    //     //     })

    //     // uploadRequest('http://localhost:3000/uploads/book/66c74cdbf4dc26be1dab1142?slug=thebook', formData2)
    //     //     .then(response => {
    //     //         console.log(response);
    //     //         // Response => Object { message: "Image uploaded successfully", fileName: "bookCover-1725209079725-thebook.png" }
    //     //     }).catch(error => {
    //     //         console.log(error)
    //     //         alert("Error")
    //     //     })

    //     return false;
    // });
});