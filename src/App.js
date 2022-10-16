import './App.css';
import { useEffect, useState } from 'react';

// fetch('https://fakestoreapi.com/products/1')

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    // from https://stackoverflow.com/questions/24038971/add-00-tofixed-only-if-number-has-less-than-two-decimal-places
    function addZeroes(num) {
        const dec = num.toString().split('.');
        const len = dec && dec.length > 2 ? dec.length : 2;
        return Number(num).toFixed(len);
    }

    // get products on page load
    useEffect(() => {
        const getProducts = async () => {
            const response = await fetch('https://fakestoreapi.com/products?limit=10');
            const productsList = await response.json();
            setProducts(productsList);
        };

        getProducts();
    }, []);

    const handleAddCart = (product) => {
        // cart = [{item:{product { item: something}},quantity:1}, ....]
        let isInCart = cart.some((cartItem) => cartItem.item.title === product.title);
        let newCart = [...cart];

        if (isInCart) {
            // if exists in cart, increment quantity by 1
            newCart.find((cartItem) => cartItem.item.title === product.title).quantity++;
        } else {
            newCart = [...cart, { item: product, quantity: 1 }];
        }

        setCart(newCart);
    };

    return (
        <div className="wrapper">
            <header>
                <h1>Welcome to Random Shop </h1>
            </header>
            <main className="mainSection">
                <section className="gallerySection">
                    <h2>All Products</h2>
                    <ul className="productCollection">
                        {products.map((product) => {
                            return (
                                <li className="product" key={product.id}>
                                    <div className="productImg">
                                        {<img src={product.image} alt={product.description} />}
                                    </div>
                                    <p className="productTitle">{product.title}</p>
                                    <p className="productPrice">{`$${addZeroes(product.price)}`}</p>
                                    <button onClick={() => handleAddCart(product)}>Add to cart</button>
                                </li>
                            );
                        })}
                    </ul>
                </section>
                <section className="cartSection">
                    <h2>Shopping Cart</h2>
                    <ul className="cartList">
                        {cart.map((cartItem) => {
                            return (
                                <li className="cartItem" key={cartItem.id}>
                                    <div className="cartItemImg">
                                        {<img src={cartItem.item.image} alt={cartItem.item.description} />}
                                    </div>
                                    <p className="cartItemTitle">{cartItem.item.title}</p>
                                    <p className="cartItemPrice">{`$${addZeroes(cartItem.item.price)}`}</p>
                                    <p className="cartQuantity">{`Qty: ${cartItem.quantity}`}</p>
                                </li>
                            );
                        })}
                    </ul>
                    <button className="checkoutBtn">Check Out</button>
                </section>
            </main>
        </div>
    );
}

export default App;
