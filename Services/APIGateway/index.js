const express = require('express');
const proxy = require('express-http-proxy'); // Using express-http-proxy
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Added PATCH method
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Proxy for AuthService
app.use('/api/auth', proxy('http://localhost:3001', {
    proxyReqPathResolver: (req) => {
        const newPath = `/api/auth${req.url}`;
        console.log(`APIGateway: Proxying ${req.method} request for Auth Service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3001';
        if (srcReq.headers.authorization) {
            proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
        }
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('APIGateway: Proxy error (AuthService):', err);
        res.status(500).send('Auth service is unavailable or encountered a proxy error');
    }
}));

// Proxy for UserService
app.use('/api/users', proxy('http://localhost:3002', {
    proxyReqPathResolver: (req) => {
        const newPath = `/api/users${req.url}`;
        console.log(`APIGateway: Proxying ${req.method} request for User Service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3002';
        if (srcReq.headers.authorization) {
            proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
        }
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('APIGateway: Proxy error (UserService):', err);
        res.status(500).send('User service is unavailable or encountered a proxy error');
    }
}));

// Proxy for RestaurantService
app.use('/api/restaurants', proxy('http://localhost:3003', {
    proxyReqPathResolver: (req) => {
        const newPath = `/api/restaurants${req.url}`;
        console.log(`APIGateway: Proxying ${req.method} request for Restaurant Service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3003';
        if (srcReq.headers.authorization) {
            proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
        }
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('APIGateway: Proxy error (RestaurantService):', err);
        res.status(500).send('Restaurant service is unavailable or encountered a proxy error');
    }
}));

// Proxy for OrderService
app.use('/api/orders', proxy('http://localhost:3004', {
    proxyReqPathResolver: (req) => {
        const newPath = `/api/orders${req.url}`;
        console.log(`APIGateway: Proxying ${req.method} request for Order Service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3004';
        if (srcReq.headers.authorization) {
            proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
        }
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('APIGateway: Proxy error (OrderService):', err);
        res.status(500).send('Order service is unavailable or encountered a proxy error');
    }
}));

// Proxy for DeliveryService (NEWLY ADDED)
app.use('/api/delivery', proxy('http://localhost:3005', {
    proxyReqPathResolver: (req) => {
        const newPath = `/api/delivery${req.url}`;
        console.log(`APIGateway: Proxying ${req.method} request for Delivery Service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Host'] = 'localhost:3005';
        if (srcReq.headers.authorization) {
            proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
        }
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error('APIGateway: Proxy error (DeliveryService):', err);
        res.status(500).send('Delivery service is unavailable or encountered a proxy error');
    }
}));


// Catch-all for any unhandled routes
app.use((req, res) => {
    console.log(`APIGateway: Unhandled request: ${req.method} ${req.url}`);
    res.status(404).send('Not Found: No proxy matched this route.');
});

app.listen(PORT, () => {
    console.log(`APIGateway running on port ${PORT}`);
});