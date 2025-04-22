export const isRedirected = (proxyRes) => proxyRes.statusCode === 302 || proxyRes.statusCode === 301

// Disable caching to have dynamic handling for proxy responses, fixes some bugs
export const disableCache = (_proxyRes, _req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0') // or a past date, e.g., 'Tue, 01 Jan 1990 00:00:00 GMT'
}

// Set all headers from the proxy response to the client response
export const copyResponseHeaders = (proxyRes, _req, res) => {
    Object.keys(proxyRes.headers).forEach((header) => {
        if (header.toLowerCase() !== 'transfer-encoding') {
            res.setHeader(header, proxyRes.headers[header])
        }
    })
}

// Fix the redirect URL in the response headers
export const fixRedirects = (proxyRes, _req, res, options) => {
    const location = proxyRes.headers.location
    let newUrl;
    try {
        newUrl = location.replace(options.target, options.url)
    } catch (err) {
        newUrl = '/'
    }
    res.redirect(newUrl)
}