$(document).ready(async function () {
    "use strict";
    let books = [];

    const previewBookList = (containerID, limit = 0) => {
        const bookList = document.getElementById(containerID);
        bookList.innerHTML = "";

        books.forEach((book, index) => {
            if (index >= limit) return; // It will still go through all the books
            let stars = '';
            for (let i = 0; i < parseInt(book.rating.averageRating); i++) {
                stars += '<i class="fas fa-star"></i>';
            }

            let bookContainer = document.createElement('div');
            bookContainer.className = 'col-md-4';
            bookContainer.innerHTML = `<div class="card book-card mb-4">
                            <img src="${book.coverImageUrl}" class="img-fluid object-fit-cover card-img-top" alt="Book 1">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p>
                                    <span class="star-rating">
                                        ${stars}
                                    </span>
                                    <span class="text-muted">${book.rating.averageRating}</span>
                                </p>
                                <p class="card-text">Price: <strong>GHc ${book.price}</strong></p>
                                <a href="/books/${book.category}/${book.slug}" class="btn btn-secondary">Learn More</a>
                                <a href="#" class="btn btn-outline-secondary cart" data-id="${book._id}"><i class="fas fa-cart-plus"></i></a>
                            </div>
                        </div>
            `;

            bookList.appendChild(bookContainer);

        });
    }



    // try {
    //     const booksResponse = await request('/api/v1/books/');
    //     books = booksResponse.books;
    // } catch (error) {
    //     alert(error.responseJSON.errMsg || error.responseJSON.message)
    // }

    // previewBookList('bookList', 10);


    const url = new URL(window.location.href);

    if (url.searchParams.has('msg')) {
        const msg = url.searchParams.get('msg');
        if(msg==='verified'){
            showAlert('success',"Your Email has been verified. Proceed to Login...");
            $("#loginForm").attr('action', '/signin?newuser=true');
        }
        else{
            showAlert('warn',msg);
        }
    }


    $("#confirmPassword").keyup(function (e) {
        if ($(this).val().length > 0) {
            if ($("#signupPassword").val() != $(this).val()) {
                $("#confirmPasswordHelp").removeClass('d-none');
                $("#confirmPasswordHelp").text("Passwords Do Not Match!!");
                $("#registerSubmit").attr('disabled', 'disabled');
                makeFieldInvalid("#confirmPassword");
                return;
            }
            $("#confirmPasswordHelp").addClass('d-none');
            $("#registerSubmit").removeAttr('disabled');
            makeFieldValid("#confirmPassword");
        }
    });

    $("#signupPassword").keyup(function (e) {
        if ($("#confirmPassword").val().length > 0) {
            if ($("#confirmPassword").val() != $(this).val()) {
                $("#confirmPasswordHelp").removeClass('d-none');
                $("#confirmPasswordHelp").text("Passwords Do Not Match!!");
                $("#registerSubmit").attr('disabled', 'disabled');
                makeFieldInvalid("#confirmPassword");
                return;
            }
            $("#confirmPasswordHelp").addClass('d-none');
            $("#registerSubmit").removeAttr('disabled');
            makeFieldValid("#confirmPassword");
        }
    });

    $("#loginForm").submit(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const email = $("#loginEmail").val().trim();
        const password = $("#loginPassword").val();

        if (email === '' || email === null) {
            $("#loginEmailHelp").removeClass('d-none');
            makeFieldInvalid("#loginEmail");
            $("#loginEmailHelp").text('Email cannot be Empty!');
        }
        if (password === '' || password === null) {
            $("#loginPasswordHelp").removeClass('d-none');
            $("#loginPasswordHelp").text('Password cannot be Empty!');
        }

        const user = { email, password };

        try {
            const loginResponse = await request('/login', 'POST', user);
            if (loginResponse.success) {
                showAlert('success', 'Login Successful...');
                makeFieldValid('#loginEmail');
                makeFieldValid('#loginPassword');
                setTimeout(() => {
                    $(this).unbind('submit').submit()
                }, 2000);
            }
        } catch (error) {
            if (error.status === 404) {
                showAlert('warn', 'Email or Password is Incorrect!!');
                makeFieldInvalid("#loginEmail");
                makeFieldInvalid("#loginPassword");
            } else if(error.status === 403){
                showAlert('warn', 'Account not verified. Check your Email!!!');
            }else {
                showAlert('warn', 'Error Logging In!!');
            }
            // console.log(typeof error.status)
        }

        return false;
    });

    $('#signupForm').submit(async function (e) {
        e.preventDefault(); // Prevent form from refreshing the page
        $('#spinner').removeClass('d-none'); // Show spinner

        // Capture form data
        const username = $('#signupUserName').val().trim();
        const email = $('#signupEmail').val().trim();
        const firstName = $('#signupFirstName').val().trim();
        const lastName = $('#signupLastName').val().trim();
        const password = $('#signupPassword').val().trim();
        // const confirmPassword = $('#signupConfirmPassword').val().trim();

        // Simple validation checks
        if (username === '' || email === '' || password === '') {
            alert("All fields are required.");
            return;
        }
        // if (password !== confirmPassword) {
        //     alert("Passwords do not match.");
        //     return;
        // }


        try {
            let response = await request('/signup', 'POST', {
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password
            })
            showAlert('success', "Signup successful! Redirecting to login page...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);
        } catch (error) {
            const errorMessage = error.responseJSON?.message || "Signup failed. Please try again.";
            $("#signupUserNameHelp").text(null);
            $("#signupEmailHelp").text(null);
            if (errorMessage.indexOf('username') > -1) {
                makeFieldInvalid("#signupUserName");
                $("#signupUserNameHelp").text(errorMessage);
            } else if (errorMessage.indexOf('email') > -1) {
                makeFieldInvalid("#signupEmail");
                $("#signupEmailHelp").text(errorMessage);
            } else {
                showAlert('warn', errorMessage);
            }
        } finally {
            $('#spinner').addClass('d-none'); // Show spinner
        }
    });

    // $("#bookList").on('click', ".cart", async function () {
    //     let response = await addToCart($(this).data('id'))
    //     // console.log(response);
    // });



});