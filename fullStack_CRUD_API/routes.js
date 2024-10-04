import { readData, writeData } from './readData.js';

const router = async (req, res) => {
    const { url, method } = req;

    const sendJSONResponse = (statusCode, data) => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    };

    let productListData;

    // Make sure to await the reading of data
    try {
        productListData = await readData(); // Await the readData function
    } catch (error) {
        sendJSONResponse(500, { message: 'Error reading data' });
        return;
    }

    // GET all products
    if (url === '/products' && method === 'GET') {
        sendJSONResponse(200, productListData);
    }

    

    // GET a product by ID
    else if (url.match(/\/products\/\d+/) && method === 'GET') {
        const id = parseInt(url.split('/')[2]); // Fix the index to [2] since you have `/products/:id`
        const product = productListData.find(p => p.id === id);
        if (product) {
            sendJSONResponse(200, product);
        } else {
            sendJSONResponse(404, { message: 'Product not found' });
        }
    }

    // POST a new product
    else if (url === '/products' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { imageUrl, title, price, date, location, company } = JSON.parse(body);
            const newProduct = {
                id: productListData.length + 1,
                imageUrl,
                title,
                price,
                date,
                location,
                company
            };
            productListData.push(newProduct);
            
            try {
                await writeData(productListData); // Await the writeData function
                sendJSONResponse(201, { message: 'Product added', product: newProduct });
            } catch (error) {
                sendJSONResponse(500, { message: 'Error writing data' });
            }
        });
    }

    // PUT to update a product by ID
    else if (url.match(/\/products\/\d+/) && method === 'PUT') {
        const id = parseInt(url.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { imageUrl, title, price, date, location, company } = JSON.parse(body);
            const productIndex = productListData.findIndex(p => p.id === id);

            if (productIndex !== -1) {
                const updatedProduct = {
                    ...productListData[productIndex],
                    imageUrl,
                    title,
                    price,
                    date,
                    location,
                    company
                };

                productListData[productIndex] = updatedProduct;
                
                try {
                    await writeData(productListData); // Await the writeData function
                    sendJSONResponse(200, { message: 'Product updated', product: updatedProduct });
                } catch (error) {
                    sendJSONResponse(500, { message: 'Error writing data' });
                }
            } else {
                sendJSONResponse(404, { message: 'Product not found' });
            }
        });
    }

    // DELETE a product by ID
    else if (url.match(/\/products\/\d+/) && method === 'DELETE') {
        const id = parseInt(url.split('/')[2]);
        const productIndex = productListData.findIndex(p => p.id === id);

        if (productIndex !== -1) {
            productListData = productListData.filter(p => p.id !== id);

            try {
                await writeData(productListData); // Await the writeData function
                sendJSONResponse(200, { message: 'Product deleted' });
            } catch (error) {
                sendJSONResponse(500, { message: 'Error writing data' });
            }
        } else {
            sendJSONResponse(404, { message: 'Product not found' });
        }
    }

    // Default route for invalid URLs
    else {
        sendJSONResponse(404, { message: 'Route not found' });
    }
};

export default router;
