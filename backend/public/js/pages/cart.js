$(document).ready(async function () {
    "use strict";
    let cartItems = [];
    let totalCost = 0;


    const userId = $("#user").val();
    let user = null;
    try {
        user = await request(`/api/v1/users/${userId}`);
    } catch (error) {
        console.log(error);
        showAlert('ward', 'Could not load profile. Refresh Page!!!');
    }



    const previewCartItems = (containerID, limit = 0) => {
        const bookList = document.getElementById(containerID);
        bookList.innerHTML = "";

        if (cartItems.length < 1) {
            bookList.textContent = "Your Cart is Empty";
            $("#payBtn").text("No items in cart");
            $("#payBtn").attr('disabled', true);
        }

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
        totalCost = 0;

        // Iterate through all cart items and sum up the total
        cartItems.forEach(item => {
            let itemTotal = item.book.price * item.quantity
            totalCost += itemTotal;
        })

        // Update the total in the summary section
        $('#subTotal').text(totalCost.toFixed(2));
        $('#total').text(totalCost.toFixed(2));
    }


    const payWithPaystack = async (cost, customer, title, metadata) => {
        // console.log(cost)
        return new Promise((resolve, reject) => {
            var handler = PaystackPop.setup({
                key: 'pk_live_2ff7c874ca266973ae02deb6bda9e8e9ad8656e4',
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                amount: parseInt(cost * 100),
                phone: customer.phone,
                currency: 'GHS',
                channels: ['mobile_money', 'card', 'bank', 'ussd', 'bank_transfer'],
                // ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                metadata,
                callback: function (response) {
                    resolve(response);
                },
                onLoad: (response) => {

                    console.log("onLoad: ", response);
                },
                onClose: function () {
                    // alert('window closed');
                    $("#payBtn").html('<i class="fas fa-check"></i> Pay Now');
                    $("#payBtn").removeAttr('disabled');
                    reject(new Error('Payment Cancelled'));
                }
            });
            handler.openIframe();
        })
    }

    const payWithPaystack2 = async (cost, customer, title, metadata) => {
        // console.log(cost)
        return new Promise((resolve, reject) => {
            const popup = new PaystackPop();
            var handler = PaystackPop.setup({ // PAYSTACK POP
                key: 'pk_live_2ff7c874ca266973ae02deb6bda9e8e9ad8656e4',
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone,
                amount: parseInt(cost * 100),
                currency: 'GHS',
                channels: ['mobile_money', 'card', 'bank', 'ussd', 'apple_pay', 'bank_transfer'],
                // ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                metadata: metadata,
                onSuccess: (transaction) => {

                    console.log("transaction", transaction);

                },

                onLoad: (response) => {

                    console.log("onLoad: ", response);
                    resolve(response);
                },

                onCancel: () => {

                    console.log("onCancel");

                },

                onError: (error) => {

                    console.log("Error: ", error.message);

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
        $("#payBtn").text("Login to make Payment");
        $("#payBtn").attr('disabled', true);
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
            if (cartItems.length < 1) {
                $("#cartItems").text("Your Cart is Empty");
                $("#payBtn").text("No items in cart");
                $("#payBtn").attr('disabled', true);
            }
        }
    });

    $("#payBtn").click(async function (e) {
        e.preventDefault();
        $("#payBtn").html('<i class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></i>');
        $("#payBtn").attr('disabled', true);

        const title = "Book Purchasing";

        let orderBooks = {
            items: cartItems.map(book => {
                return { book: book.book._id, quantity: book.quantity }
            })
        };

        let orderResponse = { _id: '434456577865' };
        try {
            orderResponse = await request('/api/v1/orders', 'POST', orderBooks);
        } catch (error) {
            showAlert("warn", `Error Creating Order. Please try again later`);
        }


        const metadata = {
            // "cart_id": orderResponse._id,
            "custom_fields": [
                {
                    "display_name": "Invoice ID",
                    "variable_name": "Invoice ID",
                    "value": orderResponse.order._id
                },
                {
                    "display_name": "Cart Items",
                    "variable_name": "cart_items",
                    "value": cartItems.map(item => {
                        return {
                            title: item.book.title,
                            amount: item.book.price * item.quantity
                        }
                    })

                }

            ]

        }

        await payWithPaystack(totalCost, user, title, metadata)
            .then(response => {
                // console.log(response);
                // console.log(orderResponse);
                return request('/api/v1/payments', 'POST', {
                    order: orderResponse.order._id,
                    transactionId: response.reference,
                    // paymentMethod: "N/A",
                    amount: totalCost
                }).then(transaction => {
                    if (transaction.payment.status) {
                        showAlert("success", "Book(s) purchased. Redirecting to your Dashboard...");
                        // Send an email
                        $("#payBtn").html('<i class="fas fa-check"></i> Pay Now');
                        setTimeout(() => {
                            window.location.href = '/user/dashboard';
                        }, 3000);
                    }
                });
            }).catch(err => {
                console.log(err);
                showAlert("warn", `Couold not process payment. Please try again later`);
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            });
    });

});