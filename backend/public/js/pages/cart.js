$(document).ready(async function () {
    "use strict";
    let cartItems = [];
    let totalCost = 0;



    const previewCartItems = (containerID, limit = 0) => {
        const bookList = document.getElementById(containerID);
        bookList.innerHTML = "";

        if (cartItems.length < 1) bookList.textContent = "Your Cart is Empty";

        cartItems.forEach((book, index) => {
            // if (index >= limit) return; // It will still go through all the books
            // let stars = '';
            // for (let i = 0; i < parseInt(book.rating.averageRating); i++) {
            //     stars += '<i class="fas fa-star"></i>';
            // }


            let bookContainer = document.createElement('div');
            bookContainer.className = 'cart-item border-bottom mb-4 pb-3 d-flex align-items-center';
            bookContainer.innerHTML = `<img src="${book.book.coverImageUrl}" alt="Book Cover" class="me-3 rounded">
                    <div id="book_${book._id}">
                        <h5>${book.book.title}</h5>
                        <p class="text-muted">Price: GH¢ ${book.book.price}</p>
                        <div class="d-flex align-items-center mb-2">
                            <label for="qty_${book._id}" class="me-2">Quantity:</label>
                            <input type="number" id="qty_${book._id}" name="quantity" value="${book.quantity}" min="1"
                                class="form-control w-25 d-inline-block me-3 qty" readonly disabled>
                            <p class="mb-0" id="tot_${book._id}"><strong>Total: GH¢ ${book.book.price * book.quantity}</strong></p>
                        </div>
                        <a href="#" data-id="${book.book._id}" class="btn btn-outline-danger btn-sm remove">Remove</a>
                    </div>`;

            bookList.appendChild(bookContainer);
            totalCost += book.book.price * book.quantity;
            $("#subTotal").text(totalCost.toFixed(2));
            $("#total").text(totalCost.toFixed(2));

        });
    }

    // Function to update the cart total after removing an item
    const updateCartTotal = () => {
        let total = 0;

        // Iterate through all cart items and sum up the total
        cartItems.forEach(item => {
            let itemTotal = item.book.price * item.quantity
            total += itemTotal;
        })

        // Update the total in the summary section
        $('#subTotal').text(total.toFixed(2));
        $('#total').text(total.toFixed(2));
    }


    const payWithPaystack = async (cost, phone, email, title) => {
        // console.log(cost)
        return new Promise((resolve, reject) => {
            var handler = PaystackPop.setup({
                key: 'pk_test_8690e3a620cadfa77b5eb24f2b6cd5a14ec4b608',
                email: email,
                amount: parseInt(cost * 100),
                currency: 'GHS',
                channels: ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer'],
                // ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                metadata: {
                    // booking_id: "sdf",
                    custom_fields: [
                        {
                            display_name: "Listing Title",
                            variable_name: "title",
                            value: title
                        }
                    ]
                },
                label: phone,
                callback: function (response) {
                    resolve(response);
                },
                onClose: function () {
                    // alert('window closed');
                }
            });
            handler.openIframe();
        })
    }

    const token = $('#token').val();

    if (typeof token === 'string' && token != '') { //user is logged in, get from database
        cartItems = (await request('/api/v1/cart')).cart;
    } else {//get from localstorage
        let items = JSON.parse(localStorage.getItem("cart"));
        for (let item of items) {
            const book = await request(`/api/v1/books/${item.bookId}`);
            cartItems.push({ _id: book._id, book, quantity: item.quantity });
        }
    }
    if (typeof cartItems === 'undefined' || cartItems === null) {
        cartItems = [];
        localStorage.setItem("cart", JSON.stringify([]));
        console.log("cartitems fixed")
    }

    previewCartItems('cartItems');





    // try {
    //     const booksResponse = await request('/api/v1/books/');
    //     books = booksResponse.books;
    // } catch (error) {
    //     alert(error.responseJSON.errMsg || error.responseJSON.message)
    // }

    $("#cartItems").on('change', ".qty", async function () {
        // let response = await addToCart($(this).data('id'))
        console.log("increasing quantity");
    });
    $("#cartItems").on('click', ".remove", async function () {
        // let response = await addToCart($(this).data('id'))
        if (confirm("Click OK to remove book from cart")) {
            // Remove the corresponding cart item
            const bookId = $(this).data('id');
            cartItems = await removeFromCart(bookId);
            $(this).closest('.cart-item').remove();
            $("#cartCount").text(cartItems.length);
            updateCartTotal();
            if (cartItems.length < 1) $("#cartItems").text("Your Cart is Empty");
        }
    });

    $("#payBtn").click(async function (e) {
        e.preventDefault();
        const start = moment(new Date(parseInt($("#booking").attr('data-start'))));
        const end = moment(new Date(parseInt($("#booking").attr('data-end'))));

        const noDays = end.diff(start, 'days') + 1;
        const rate = parseFloat($("#property").data('rate'));
        const fee = parseFloat($("#property").data('fee'));
        const cost = rate * noDays + fee;

        const phone = $("#user").data('phone');
        const slugPhone = String(phone).replace(/\s+/g, '');
        const email = $("#user").data('email') || `customer_${slugify(slugPhone)}@ronaproperties.com`;
        const title = $("#property").data('title');

        let booking = {
            guest: '6509f5e1fc4da6115b4e83de',
            listing: $("#property").val(),
            checkInDate: Date.parse(start),
            checkOutDate: Date.parse(end),
            status: "pending"
        }
        let response = {}
        await payWithPaystack(cost, phone, email, title)
            .then(result => {
                response = result
                return postRequest('bookings', booking)
            }).then(newBooking => {
                // const userID = $("#user").val();
                const userID = '6509f5e1fc4da6115b4e83de';
                console.log(newBooking)
                return postRequest('transactions', {
                    user: userID,
                    booking: newBooking._id,
                    reference: response.reference,
                    for: "property",
                    description: "Paystack payment for property listing " + $('#property').data('title')
                })
            }).then(transaction => {
                // show alert
                if (transaction.success) {
                    $("#bookingAlertMsg").html("The location has been successfully booked");
                    // Send an email
                    $("#bookingAlert").addClass("alert-success");
                    $("#bookingAlert").show();
                    $("#payBtn").hide();
                    setTimeout(() => {
                        $("#bookingAlert").hide();
                        $("#bookingAlert").removeClass("alert-success");
                    }, 5000);
                }
                else if (transaction.paid >= transaction.amount) {
                    $("#bookingAlertMsg").html(`The location has been successfully booked with an overpayment. <br> Paid ${transaction.paid} instead of ${transaction.amount}. <br> Balance to be received on arrival!`);
                    // Send an email
                    $("#bookingAlert").addClass("alert-warning");
                    $("#bookingAlert").show();
                    $("#payBtn").hide();
                    setTimeout(() => {
                        $("#bookingAlert").hide();
                        $("#bookingAlert").removeClass("alert-warning");
                    }, 5000);
                } else {
                    $("#bookingAlertMsg").html(`The location could not be booked due to an underpayment. <br> Paid ${transaction.paid} instead of ${transaction.amount}. <br> Contact us to resolve this issue!`);
                    // Send an email
                    $("#bookingAlert").addClass("alert-warning");
                    $("#bookingAlert").show();
                    $("#payBtn").hide();
                    setTimeout(() => {
                        $("#bookingAlert").hide();
                        $("#bookingAlert").removeClass("alert-warning");
                    }, 5000);
                }
                // console.log(transaction)
                // console.log('success. transaction ref is ' + response.reference);
            }).catch(err => {
                $("#bookingAlertMsg").html(`We encountered an issue and we are working to resolve that. Please try again later`);
                // Send an email
                $("#bookingAlert").addClass("alert-warning");
                $("#bookingAlert").show();
                $("#payBtn").hide();
                setTimeout(() => {
                    $("#bookingAlert").hide();
                    $("#bookingAlert").removeClass("alert-warning");
                }, 5000);
            });
    });

});