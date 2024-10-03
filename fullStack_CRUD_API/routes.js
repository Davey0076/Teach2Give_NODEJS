import { readData, writeData } from './db.js';
import { v4 as uuidv4 } from 'uuid';

const router = async (req, res) => {
    const { url, method } = req;
    
    const sendJSONResponse = (statusCode, data) => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    };

    let productListData = readData(); // Read data from file

    // GET all products
    if (url === '/products' && method === 'GET') {
        sendJSONResponse(200, productListData);
    }

    // GET a product by ID
    else if (url.match(/\/products\/\d+/) && method === 'GET') {
        const id = parseInt(url.split('/')[3]);
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

        req.on('end', () => {
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
            writeData(productListData); // Write the updated data to file
            sendJSONResponse(201, { message: 'Product added', product: newProduct });
        });
    }

    // PUT to update a product by ID
    else if (url.match(/\/products\/\d+/) && method === 'PUT') {
        const id = parseInt(url.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

    
    
    
        req.on('end', () => {
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
                writeData(productListData);
                sendJSONResponse(200, { message: 'Product updated', product: updatedProduct });
            } else {
                sendJSONResponse(404, { message: 'Product not found' });
            }
        });
    }
    

    // DELETE a product by ID
   //DELETE to delete a product
    else if (url.match(/\/products\/\d+/) && method === 'DELETE') {
        const id = parseInt(url.split('/')[3]);
        const productIndex = productListData.findIndex(p => p.id === id);
    
        if (productIndex !== -1) {
            productListData = productListData.filter(p => p.id !== id);
            writeData(productListData);
            sendJSONResponse(200, { message: 'Product deleted' });
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
