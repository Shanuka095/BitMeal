const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
}));

app.use('/api/users', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`APIGateway running on port ${PORT}`);
});