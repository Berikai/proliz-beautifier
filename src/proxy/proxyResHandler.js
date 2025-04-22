import proxyBodyHandler from './proxyBodyHandler.js'
import { copyResponseHeaders, disableCache, isRedirected, fixRedirects } from './utils/proxyUtils.js'

export default (proxyRes, req, res, options) => {
    copyResponseHeaders(proxyRes, req, res)
    disableCache(proxyRes, req, res)

    // Handle the request type plugins before the response happens
    for (const plugin of options.plugins) {
        if(plugin.enabled && plugin.type === 'request') {
            plugin.function(proxyRes, req, res)
        }
    }

    if (isRedirected(proxyRes))
        fixRedirects(proxyRes, req, res, options)
    else
        // Handle the response type plugins after the response happens
        proxyBodyHandler(proxyRes, req, res, options)
}