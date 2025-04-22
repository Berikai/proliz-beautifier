import { createProxyMiddleware } from 'http-proxy-middleware'
import proxyResHandler from './proxyResHandler.js'

export default (options) => createProxyMiddleware({
    target: options.target ?? null,
    router: options.router ?? null,
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
        proxyRes: (proxyRes, req, res) => proxyResHandler(proxyRes, req, res, options),
        proxyReq: (proxyReq, req, _res) => {
            // If the request has a body, re-attach it to the proxy request
            if (req.rawBody && req.method === 'POST' || req.method === 'PUT') {
                proxyReq.setHeader('Content-Length', Buffer.byteLength(req.rawBody))
                proxyReq.write(req.rawBody)
            }
        },
        error: (err, _req, res) => {
            console.error('Proxy Error:', err)
            res.status(500).send('Proxy error occurred')
        },
    },
})