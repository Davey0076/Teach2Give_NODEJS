const addedData = []  // Global array to store fetched products
let cart = []         // Global array for cart items

// Fetch product data from the API and populate the global addedData array
async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();



        // Add products to the global array
        addedData.push(...products);
        console.log("Products added successfully: ", addedData);

        // Populate products on the DOM
        populateProducts();
    } catch (error) {
        console.log("Error fetching products: ", error);
    }
}

// Function to populate products on the DOM
function populateProducts() {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; // Clear container before populating

    // Iterate over addedData and create HTML elements for each product
    addedData.forEach((product) => {
        //logging
        console.log("Product in addedData: ", product);


        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>Price: Kshs.${product.price}</p>
            <p>Date: ${product.date}</p>
            <p>Location: ${product.location}</p>
            
           <button onclick="addToCart(${product.id})">Add to Cart</button>
           <button onclick="viewProduct(${product.id})">View</button>
           <button onclick="editProduct(${product.id})">Edit</button>
           <button onclick="deleteProduct(${product.id})">Delete</button>
           

        `;
        productContainer.appendChild(productDiv);
    });
}

// Function to add product to the cart
function addToCart(productId) {
    // Find the product by its ID from addedData
    const product = addedData.find(p => p.id == productId);
    console.log("Product to add:", product);

    // Check if the product is already in the cart
    if (product) {
        const existingProduct = cart.find(p => p.id === productId);

        if (existingProduct) {
            // If product exists, increase its quantity
            existingProduct.quantity += 1;
        } else {
            // If not, add the product to the cart with quantity 1
            cart.push({ ...product, quantity: 1 });
        }

        // Update the cart UI
        updateCartUI();
    }
    else {
        console.log("Product not found:", productId);
    }
}

// Function to update the cart UI
function updateCartUI() {
    const cartContainer = document.getElementById('cartContainer');

    // Clear the cart container but preserve the header
    cartContainer.innerHTML = '<h2 id="cart__header">My Cart</h2>';

    // Check if the cart is empty
    if (cart.length === 0) {
        // Display a message if no items are available in the cart
        const emptyMessage = document.createElement('p');
        emptyMessage.classList.add('empty__message')
        emptyMessage.innerText = 'No Items Available in the Cart';
        cartContainer.appendChild(emptyMessage);
    } else {
        // If there are items in the cart, iterate over them and display
        cart.forEach((product, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <h3>${product.title}</h3>
                <p>Price: Kshs.${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
                <button onclick="increaseQuantity(${product.id})">+</button>
                <button onclick="decreaseQuantity(${product.id})">-</button>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartContainer.appendChild(cartItemDiv);
        });
    }
}


// Function to increase the quantity of a product in the cart
function increaseQuantity(productId) {
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity += 1;
        updateCartUI(); // Update cart UI after changing quantity
    }
}

// Function to decrease the quantity of a product in the cart
function decreaseQuantity(productId) {
    const product = cart.find(p => p.id === productId);
    if (product) {
        if (product.quantity > 1) {
            product.quantity -= 1;
        } else {
            // If quantity is 1, remove the product from the cart
            cart = cart.filter(p => p.id !== productId);
        }
        updateCartUI(); // Update cart UI after changing quantity
    }
}

// Function to remove a product from the cart
function removeFromCart(index) {
    // Remove the product from the cart array by index
    cart.splice(index, 1);
    updateCartUI(); // Update cart UI after removing the product
}

// Initial call to fetch data and populate products
fetchData();
updateCartUI();

// Sort Buttons
const sortPriceAscBtn = document.getElementById('sort-price-asc');
const sortPriceDescBtn = document.getElementById('sort-price-desc');
const sortDateAscBtn = document.getElementById('sort-date-asc');
const sortDateDescBtn = document.getElementById('sort-date-desc');

// Filter Elements
const priceFilterInput = document.getElementById('priceFilter');
const filterBtn = document.getElementById('filter-btn');

// Sorting Logic
sortPriceAscBtn.addEventListener('click', () => {
    addedData.sort((a, b) => a.price - b.price);
    populateProducts();  // Refresh the product list
});

sortPriceDescBtn.addEventListener('click', () => {
    addedData.sort((a, b) => b.price - a.price);
    populateProducts();  // Refresh the product list
});

sortDateAscBtn.addEventListener('click', () => {
    addedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    populateProducts();  // Refresh the product list
});

sortDateDescBtn.addEventListener('click', () => {
    addedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    populateProducts();  // Refresh the product list
});

// Filter by Price Logic
filterBtn.addEventListener('click', () => {
    const filterPrice = parseFloat(priceFilterInput.value);

    if (isNaN(filterPrice)) {
        alert("Please enter a valid price");
        return;
    }

    // Filter products that match the price exactly
    const filteredProducts = addedData.filter(product => product.price == filterPrice);

    // Update product display with filtered products
    populateFilteredProducts(filteredProducts);
});

// Populate products based on filtering
function populateFilteredProducts(filteredProducts) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; // Clear container before populating

    if (filteredProducts.length === 0) {
        productContainer.innerHTML = `<p>No products match the filter.</p>`;
    } else {
        filteredProducts.forEach((product) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.title}">
                <h2>${product.title}</h2>
                <p>Price: Kshs.${product.price}</p>
                <p>Date: ${product.date}</p>
                <p>Location: ${product.location}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
                <button onclick="viewProduct(${product.id})">View</button>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            `;
            productContainer.appendChild(productDiv);
        });
    }
}



// Get the dialog and button elements
const addProductDialog = document.getElementById("addProductDialog");
const addProductBtn = document.getElementById("add-product-btn");
const closeDialogBtn = document.getElementById("closeDialogBtn");

// Open the dialog when the "Add New Product" button is clicked
addProductBtn.addEventListener("click", () => {
    addProductDialog.showModal(); // Opens the dialog
});

// Close the dialog when the "Close" button is clicked
closeDialogBtn.addEventListener("click", () => {
    addProductDialog.close(); // Closes the dialog
});

// Close the dialog when the form is submitted (you can handle save logic later)
document.getElementById('addProductForm').addEventListener('submit', function (event) {
    event.preventDefault();
    alert('Product saved (placeholder)!');
    addProductDialog.close(); // Close the dialog after submission
});


//form submission
// Handle form submission
document.getElementById('addProductForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Gather form data
    const formData = {
        imageUrl: document.getElementById('imageUrl').value,
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        date: document.getElementById('date').value,
        location: document.getElementById('location').value,
        company: document.getElementById('company').value
    };

    // Send the data to the server using POST request
    const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Convert form data to JSON
    });

    if (response.ok) {
        alert('Product added successfully');
        document.getElementById('addProductDialog').close(); // Close the dialog
        // Optionally, you could refresh the product list on the page
    } else {
        alert('Error adding product');
    }
});

// Function to view product details
async function viewProduct(productId) {
    const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        const product = await response.json();

        // Create the dialog content to show the product details
        const viewDialog = document.createElement('dialog');
        viewDialog.setAttribute('id', 'viewProductDialog');
        viewDialog.innerHTML = `
            <h2>Product Details</h2>
            <p><strong>Title:</strong> ${product.title}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Date:</strong> ${product.date}</p>
            <p><strong>Location:</strong> ${product.location}</p>
            <p><strong>Company:</strong> ${product.company}</p>
            <p><strong>Image URL:</strong> <a href="${product.imageUrl}" target="_blank">${product.imageUrl}</a></p>
            <button id="closeViewDialog">Close</button>
        `;
        
        // Append and show the dialog
        document.body.appendChild(viewDialog);
        viewDialog.showModal();

        // Close button functionality
        document.getElementById('closeViewDialog').addEventListener('click', () => {
            viewDialog.close();
            viewDialog.remove(); // Remove dialog from the DOM
        });
    } else {
        alert('Error fetching product details');
    }
}

// Function to edit product details
async function editProduct(productId) {
    const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        const product = await response.json();

        // Open the existing form for adding products and populate it with product data
        document.getElementById('imageUrl').value = product.imageUrl;
        document.getElementById('title').value = product.title;
        document.getElementById('price').value = product.price;
        document.getElementById('date').value = product.date;
        document.getElementById('location').value = product.location;
        document.getElementById('company').value = product.company;

        const editDialog = document.getElementById('addProductDialog');
        editDialog.showModal(); // Show the form in a dialog for editing

        // Change the submit event handler to update the product
        document.getElementById('addProductForm').onsubmit = async function(event) {
            event.preventDefault(); // Prevent form refresh
            
            const updatedData = {
                imageUrl: document.getElementById('imageUrl').value,
                title: document.getElementById('title').value,
                price: document.getElementById('price').value,
                date: document.getElementById('date').value,
                location: document.getElementById('location').value,
                company: document.getElementById('company').value
            };

            // Send the updated data to the backend
            const updateResponse = await fetch(`http://localhost:3000/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (updateResponse.ok) {
                alert('Product updated successfully');
                editDialog.close();
                // Optionally, refresh the product list
            } else {
                alert('Error updating product');
            }
        };
    } else {
        alert('Error fetching product data');
    }
}


// Function to delete product
async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

    

        if (response.ok) {
            alert('Product deleted successfully');
            // Optionally, refresh the product list on the page
        } else {
            alert('Error deleting product');
        }
    }
}





