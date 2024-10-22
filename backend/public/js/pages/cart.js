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
        cartItems.forEach(item=>{
            let itemTotal = item.book.price * item.quantity
            total += itemTotal;
        })

        // Update the total in the summary section
        $('#subTotal').text(total.toFixed(2));
        $('#total').text(total.toFixed(2));
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

    $("#payBtn").click(function (e) { 
        // e.preventDefault();
        showAlert('warn','One-Click Payment is still under construction');
    });

});