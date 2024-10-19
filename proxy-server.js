const http = require('http');
const WebSocket = require('ws');
const httpProxy = require('http-proxy');

// Thiết lập proxy server
const proxy = httpProxy.createProxyServer({ ws: true });

// Tạo HTTP server
const server = http.createServer((req, res) => {
    proxy.web(req, res, { target: 'http://192.168.44.36>:81' });
});

// Thiết lập WebSocket proxy
server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head, { target: 'ws://192.168.44.36>:81' });
});

// Chạy server trên cổng 443
server.listen(443, () => {
    console.log('Proxy server running on port 443');
});
