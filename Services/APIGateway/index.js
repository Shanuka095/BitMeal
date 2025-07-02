const express = require('express');
const proxy = require('express-http-proxy');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/auth', proxy('http://localhost:3001', {
    proxyReqPathResolver: (req) => {
        const newPath = `/api/auth${req.url.replace(/\/+$/, '')}`;
        console.log(`Proxying ${req.method} request to AuthService: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3001';
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('Proxy error (AuthService):', err);
        res.status(500).send('Proxy error');
    }
}));

app.use('/api/users', proxy('http://localhost:3002', {
    proxyReqPathResolver: (req) => {
        const newPath = `/api/users${req.url.replace(/\/+$/, '')}`;
        console.log(`Proxying ${req.method} request to UserService: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3002';
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('Proxy error (UserService):', err);
        res.status(500).send('Proxy error');
    }
}));

app.use('/api/restaurants', proxy('http://localhost:3003', {
    proxyReqPathResolver: (req) => {
        const newPath = `/api/restaurants${req.url.replace(/\/+$/, '')}`;
        console.log(`Proxying ${req.method} request to RestaurantService: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3003';
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('Proxy error (RestaurantService):', err);
        res.status(500).send('Proxy error');
    }
}));

// New: Proxy for OrderService
app.use('/api/orders', proxy('http://localhost:3004', { // PORT for OrderService
    proxyReqPathResolver: (req) => {
        const newPath = `/api/orders${req.url.replace(/\/+$/, '')}`;
        console.log(`Proxying ${req.method} request to OrderService: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3004';
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('Proxy error (OrderService):', err);
        res.status(500).send('Proxy error');
    }
}));


app.use((req, res) => {
    console.log(`Unhandled request: ${req.method} ${req.url}`);
    res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`APIGateway running on port ${PORT}`);
});
