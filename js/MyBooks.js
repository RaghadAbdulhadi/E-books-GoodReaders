// cart constructor function
const Cart = function (books) {
    this.books = books;
}

// remove book from the cart
Cart.prototype.removeBook = function (bookName) {
    let bookIndex;
    for (let i = 0; i < this.books.length; i++) {
        if (this.books[i].name == bookName) {
            bookIndex = i;
            break;
        }
    }
    this.books.splice(bookIndex, 1);
}

let cart;

// Handel the event of clicking on remove link
let divContainer = document.getElementById("main-div");
divContainer.addEventListener('click', removeBookFromCart);


function removeBookFromCart(event) {
    event.preventDefault();
    if (event.target.nodeName === 'A') {
        console.log('deleting node!', event.target.parentNode.parentNode);
        let bookName = event.target.parentNode.children[0].textContent;
        console.log(bookName, 'book name')
        cart.removeBook(bookName);

        updateCounter();
        saveToLocalStorage();
        renderCart();
    }
}


// update cart counter
function updateCounter() {
    let counter = document.getElementById('cart-items');
    counter.textContent = cart.books.length;
}

// save carts' books in the local storage
function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart.books));
}

// render all books from the cart onto the page
function renderCart() {
    loadCart();
    clearCart();
    showCart();
}

function loadCart() {
    const cartBooks = JSON.parse(localStorage.getItem('cart')) || [];
    cart = new Cart(cartBooks);
}

function clearCart() {
    let subContainerDiv = document.getElementById("main-div");;
    subContainerDiv.textContent = "";
}

let containerDiv;
let pElement;
let totalPrice;
function showCart() {
    totalPrice = calcTotalPrice();
    for (let i = 0; i < cart.books.length; i++) {
        // create elements needed
        containerDiv = document.getElementById("main-div");
        let divElement1 = document.createElement('div')
        let imgElement = document.createElement('img');
        let divElement2 = document.createElement('div')
        let h5Element = document.createElement('h5');
        let h6Element = document.createElement('h6');
        let aElement = document.createElement('a');

        // set attributes
        divElement1.setAttribute('class', 'item');
        imgElement.setAttribute('src', cart.books[i].img);
        divElement2.setAttribute('class', 'details');
        aElement.setAttribute('class', 'remove-btn');

        // set elements' content
        h5Element.textContent = cart.books[i].name;
        h6Element.textContent = '$' + cart.books[i].price;
        aElement.textContent = "remove";

        // append childs
        divElement2.appendChild(h5Element);
        divElement2.appendChild(h6Element);
        divElement2.appendChild(aElement);
        divElement1.appendChild(imgElement);
        divElement1.appendChild(divElement2);
        containerDiv.appendChild(divElement1);
    }

    pElement = document.getElementById('total');
    if (cart.books.length == 0) {
        pElement.textContent = "Your cart is Empty!"
    } else {
        pElement.textContent = "Total Price: $" + totalPrice.toFixed(2);
    }
}

function calcTotalPrice() {
    let total = 0;
    for (let i = 0; i < cart.books.length; i++) {
        total += parseFloat(cart.books[i].price);
    }
    return total;
}

let checktBtn = document.getElementById('checkout');
checktBtn.addEventListener('click', checkout);

function checkout(event) {
    if (cart.books.length !== 0) {
        let answer = confirm(`Your total price is: $${totalPrice.toFixed(2)}. Do you wish to continue?`);
        if (answer == true) {
            containerDiv.textContent = "Your cart is Empty!";
            pElement.textContent = "";
            cart.books = [];
            updateCounter();
            saveToLocalStorage();
        }
    } else {
        event.target.disabled = true;
    }
}

renderCart();