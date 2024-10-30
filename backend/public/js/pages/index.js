$(document).ready(async function () {
    "use strict";
    let books = [];


    const previewBookList = (containerID, limit = 0) => {
        const bookList = document.getElementById(containerID);
        bookList.innerHTML = "";
        // console.log(books.length, books[0].title)
    
        books.forEach((book, index) => {
            if (index >= limit) return; // It will still go through all the books
    
            let bookContainer = document.createElement('div');
            bookContainer.className = 'col-6 col-md-2 mb-4';
            bookContainer.innerHTML = `<a href="/books/${book.category}/${book.slug}">
            <img src="${book.coverImageUrl}" class="img-fluid object-fit-cover rounded border border-black" alt="Book 1">
          <h6 class="mt-2">${book.title} (${book.rating.averageRating} <i class="fas fa-star text-warning"></i>)
          </h6></a>`;
    
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


    try {
        const booksResponse = await request('/api/v1/books/');
        books = booksResponse.books;
    } catch (error) {
        alert(error.responseJSON.errMsg || error.responseJSON.message)
    }

    previewBookList('bookList', 6);
    previewFeaturedBooks(books, "featuredBooks");


    // FOR THE BOOK SIGNING EVENT ***************

    $('#eventFlyerModal').modal('show'); // only for the event
    
    $("#buyFeaturedBook").click(function (e) { 
        e.preventDefault();
        const featuredBook = books.filter(book=>{
            return book.title === 'Discover You';
        })[0]
        addToCart(featuredBook._id);
        setTimeout(() => {
            window.location.href = "/cart";
        }, 2000);
    });

    // END OF FOR THE BOOK SIGNING EVENT ********

    // $(".loader-img").removeClass("loader-img");


    // previewNavBooksList('navbarBooksListing')
    // carouselBookList('carouselBookListing', 6);
    // previewFeaturedSeries('featuredSeries', 5);

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