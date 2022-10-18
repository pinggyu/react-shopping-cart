import './App.css';
import { useEffect, useState } from 'react';

// fetch('https://fakestoreapi.com/products/1')

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [checkedState, setCheckedState] = useState([]);
    const [total, setTotal] = useState(0);

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

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((state, index) => (index === position ? !state : state));
        setCheckedState(updatedCheckedState);
    };

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

    const handleRemove = () => {
        // array of cart index to remove
        const productsToRemove = checkedState.reduce((value, bool, index) => (bool ? value.concat(index) : value), []);
        // let productsToRemove = [];
        // for (const [index, value] of checkedState.entries()) {
        //     if (value) {
        //         productsToRemove.push(index);
        //     }
        // }
        let newCart = [...cart];
        // reverse order to not mess up the specific index of values yet to be deleted
        for (let i = productsToRemove.length - 1; i >= 0; i--) {
            newCart.splice(productsToRemove[i], 1);
        }

        setCart(newCart);
    };

    useEffect(() => {
        const newCheckedState = new Array(cart.length).fill(false);
        setCheckedState(newCheckedState);
    }, [cart]);

    useEffect(() => {
        const calculateTotal = () => {
            const newTotal = cart.reduce((partialSum, a) => partialSum + a.item.price * a.quantity, 0);
            setTotal(newTotal);
        };

        calculateTotal();
    }, [cart]);

    return (
        <div className="wrapper">
            <header>
                <h1>Welcome to Random Shop </h1>
            </header>
            <main className="mainSection">
                <section className="gallerySection">
                    <h2>All Products</h2>
                    <ul className="productCollection">
                        {products.map((product, index) => {
                            return (
                                <li className="product" key={`${product.id}${index}`}>
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
                        {cart.map((cartItem, index) => {
                            return (
                                <li className="cartItem" key={`${cartItem.item.id}${index}`}>
                                    <input
                                        type="checkbox"
                                        id={`selectCheckbox${index}`}
                                        className="selectCheckBox"
                                        onChange={() => handleOnChange(index)}
                                        name={cartItem.item.title}
                                        value={cartItem.item.title}
                                        checked={checkedState[index] || ''}
                                    />
                                    <label htmlFor={`selectCheckbox${index}`}></label>
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
                    <div className="totalPrice">{`Cart total: $${addZeroes(total)}`}</div>
                    <button className="deleteBtn" onClick={() => handleRemove()}>
                        Remove from Cart
                    </button>
                    <button className="checkoutBtn">Check Out</button>
                </section>
            </main>
        </div>
    );
}

export default App;
