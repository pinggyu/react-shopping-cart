# Objective

Mini shopping cart app to review common array methods & handling multiple checkbox states.

## Common array methods

### .map

`map()` returns a new array with the result of calling a given function on every element of the original array that map is called on. The original array is not modified.

#### Example

Using `map()` to update an array of checked states to track which items in cart are checked at all times by matching `index` of the item with the position in the state array (to update checked item to `true`):

```
const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((state, index) => (index === position ? !state : state));
    setCheckedState(updatedCheckedState);
};
```

### .some

`some()` returns `true` or `false`. `true` if at least one element in the array passes the condition provided, `false `if otherwise. The original array is not modified.

#### Example

Using `some()` to check if a given item already exists in the cart, if `true`, update the quantity, if `false`, add the whole item to the cart

```
let isInCart = cart.some((cartItem) => cartItem.item.title === product.title);
```

### .find

`find()` is similar to `some()` in the sense that they both test for a specific condition/function provided but `find()` returns the FIRST element found that satifies it or `undefined` if nothing satisfies it. The original array is not modified.

#### Example

`find()` is used to get the item name that has been added to cart and match it to the current item in cart to increment quantity for that specific cart item `object`.

```
if (isInCart) {
    // if exists in cart, increment quantity by 1
    newCart.find((cartItem) => cartItem.item.title === product.title).quantity++;
} else {
    newCart = [...cart, { item: product, quantity: 1 }];
}
```

### .reduce

`reduce()` applies a reducer function on all the elements of the array. It's often used to find the sum/total of all elements. It returns the value resulting from the reducer function. The original array is not modified.

The first time that the callback is run there is no "return value of the previous calculation". If supplied, an initial value can be used otherwise the array element at index 0 is used.

#### Example

To populate a new array with checked items to remove from cart (checked items would have a true value):

```
const productsToRemove = checkedState.reduce((value, bool, index) => (bool ? value.concat(index) : value), []);
```

which is equivalent to doing:

```
let productsToRemove = [];
for (const [index, bool] of checkedState.entries()) {
    if (bool) {
        productsToRemove.push(index);
    }
}
```

To calculate the total in the cart (price \* quantity):

```
const calculateTotal = () => {
    const newTotal = cart.reduce((partialSum, a) => partialSum + a.item.price * a.quantity, 0);
    setTotal(newTotal);
};
```

## Handling multiple checkbox states

### 1. Inititalize a state to track each checkbox

```
const [checkedState, setCheckedState] = useState([]); // [true,true,false,false,false] where true is checked
```

If the length of the checkboxes is fixed and known, then:

```
const [checkedState, setCheckedState] = useState(
  new Array(listOfCheckboxes.length).fill(false)
);
```

### 2. Control input box (managed by state)

Controlled input box should only be change by managing the state. The `|| ''` in `checked=` is to bypass the warning that the element is first undefined and then set to false after being added to cart.

```
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
```

### 3. Track checked state with `onChange`

The state array for whether an element is checked is updated to `true` or `false` thanks to its index and `onChange`.

Additional resource: https://www.freecodecamp.org/news/how-to-work-with-multiple-checkboxes-in-react/
