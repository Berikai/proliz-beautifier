import zlib from 'zlib'
import zstd from '@mongodb-js/zstd'

export default class {
    constructor() {
        this.compression = 'gzip'
    }

    async decompress(buffer) {
        try {
            this.result = zlib.gunzipSync(buffer)
            return this.result.toString()
        } catch (err) {
            try {
                this.compression = 'brotli'
                this.result = zlib.brotliDecompressSync(buffer)
                return this.result.toString()
            } catch (err) {
                try {
                    this.compression = 'zstd'
                    this.result = await zstd.decompress(buffer)
                    return this.result.toString()
                } catch (err) {
                    this.compression = 'text'
                    return buffer.toString()
                }
            }
        }
    }

    async compress(data) {
        try {
            if(this.compression === 'gzip') {
                this.compressed = zlib.gzipSync(data)
                return this.compressed
             } else if (this.compression = 'brotli') {
                this.compressed = zlib.brotliCompressSync(data)
                return this.compressed
             } else if (this.compression = 'zstd') {
                this.compressed = await zstd.compress(data)
                return this.compressed
             } else {
                return data.toString()
            }
        } catch (err) {
            throw new Error(`Compression error: ${err.message}`)
        }
    }
}