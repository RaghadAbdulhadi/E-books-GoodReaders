const productDom = document.querySelector(".books");
let cartcounter = document.querySelector(".cart-items");
let cartTotal = document.querySelector(".cart-total");
// cart
let cart = [];
// buttons
let buttonsDom = [];

function Products() {

}
let Allproducts = [];
let Allnewproducts = [];
let products;
let productsforSaving;
let savedProducts = [];
Products.prototype.getandRenderProducts = async() => {
    try {
        let result = await fetch("../../books.json");
        let data = await result.json();
        products = data.books;
        productsforSaving = products[0];
        let categoriesArr = ["self-help", "cookbooks", "poetry", "fitness", "Novel", "shortStories", "science", "Art"];

        for (let i = 0; i < categoriesArr.length; i++) {
            Allproducts = products[0][categoriesArr[i]];
            Allnewproducts = Allproducts.map(book => {
                const img = book['img-url'];
                const name = book.name;
                const author = book.author;
                const price = book.price;
                const publishedDate = book['published-date']
                const pdf = book['book-url'];
                const intro = book.introduction;
                const id = parseInt(book.id) + (i * 10);
                savedProducts.push({ img, name, author, price, publishedDate, pdf, intro, id });
                return { img, name, author, price, publishedDate, pdf, intro, id };
            })

            let result = "";
            result = result + `<h4 class="category"> ${categoriesArr[i]} <h4> `;
            result += `<div class="book-grid">`
            Allnewproducts.forEach(product => {

                    result += `
        <article class="one-book">
        <div class="flip-card">
        <div class="flip-card-inner">
        <div class="flip-card-front">
        <img src=${product.img}
        alt="Avatar" >
        </div>
        <div class="flip-card-back">
        <p>
        ${product.intro} 
        </p> 
        </div>
        </div>
        </div>
        <div class="book-Info">
        <h6>${product.name}</h6>
        <h6>By ${product.author}</h6>
        <h6>${product.price}</h6>
        <h6>${product.publishedDate}</h6>
        </div>
        <div class="button-container">
        <button class="contains-pdf">
        <a href=${product.pdf} class="button">Read as soft copy <i
        class="fas fa-book-reader"></i></a>
        </button>
        <br>
        <button class="add-button" id=${product.id}>Add To Cart</button>
        </div>
        </article>
        `;



                }

            )

            result += `<div>`
            productDom.innerHTML += result;

        }


    } catch (error) {
        console.log(error)
    }

}


// local Storage
class Storage {
    static saveProducts() {
        localStorage.setItem("products", JSON.stringify(savedProducts));
    }
    static getStorage(id) {
        let retrievedspecific = JSON.parse(localStorage.getItem("products"));
        return retrievedspecific.find(product => parseInt(product.id) === parseInt(id))
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }

}

function Cart() {

    this.setCartValues = function() {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount
        })
        cartTotal.innerText = tempTotal.toFixed(2);
        cartcounter.innerText = itemsTotal;
        console.log(cartcounter);
    }
}

let id;
Products.prototype.getbagButtons = () => {
    const buttons = [...document.querySelectorAll(".add-button")]
    buttonsDom = buttons;
    buttons.forEach(button => {
        id = button.id;

        let inCart = cart.find(item => item.id === id);
        if (inCart) {
            button.innerText = "In Cart";
            button.disabled = true;
        }
        button.addEventListener('click', (event) => {

            event.target.innerText = "In Cart";
            event.target.disabled = true;
            // get product from products
            let cartItem = {...Storage.getStorage(button.id), amount: 1 };

            // add product to the cart
            cart = [...cart, cartItem];

            // save cart in local storage
            Storage.saveCart(cart);
            // set cart values 
            cartInstorage = new Cart
            cartInstorage.setCartValues(cart);

        })
    })

}
document.addEventListener("DOMContentLoaded", function() {
    const products = new Products();
    products.getandRenderProducts().then(() => {
        Storage.saveProducts()
    }).then(() => {
        products.getbagButtons();
    })
})