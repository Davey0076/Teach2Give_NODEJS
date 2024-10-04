import http from 'http';
import chalk from 'chalk';
import router from './routes.js';

const server = http.createServer((req, res) => {
    // Add CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
    
    // Handle preflight requests (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);  // No content
        return res.end();
    }

    // Pass request to the router
    router(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(chalk.green(`Server running at http://localhost:${PORT}`));
});
