import CompressionUtils from './utils/compressionUtils.js'

export default (proxyRes, req, res, options) => { 
    const body = {
        chunks: [],
        data: null,
    }

    proxyRes.on('data', (chunk) => {
        body.chunks.push(chunk)
    })

    proxyRes.on('end', async () => {
        // Create a new instance of CompressionUtils
        const C = new CompressionUtils()

        // Concatenate all chunks into a single Buffer
        body.data = Buffer.concat(body.chunks)

        // Check if the response is compressed
        const isCompressed = proxyRes.headers['content-encoding'] !== undefined

        // Decompress the response if it is compressed
        let decompressed = isCompressed ? await C.decompress(body.data) : body.data

        // Zstd decompression works, but compression back doesn't somehow
        // This is a workaround to set the content-encoding to identity
        // when the response is compressed with zstd
        if (proxyRes.headers['content-encoding'] === 'zstd') {
            res.setHeader('content-encoding', 'identity')
        }

        // Apply the plugin changes to the decompressed content
        for (const plugin of options.plugins) {
            if(plugin.enabled && plugin.type === 'response') {
                const editor = (newContent) => {
                    decompressed = Buffer.from(newContent)
                }
                plugin.function(proxyRes, req, res, decompressed.toString(), editor)
            }
        }

        try {
            // Fix the Content-Length header, just in case
            res.setHeader('Content-Length', Buffer.byteLength(decompressed))
        } catch (error) {
            // Couldn't set the header, ignore
        }
    
        // Compress the response if it was compressed originally
        const compressed = isCompressed && res.getHeader('content-encoding') !== 'identity' ? await C.compress(decompressed) : decompressed

        // Send the response
        res.end(compressed)
    })
}