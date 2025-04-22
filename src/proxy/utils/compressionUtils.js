import zlib from 'zlib'
import zstd from '@skhaz/zstd'

export default class {
    constructor() {
        this.compression = 'gzip'
    }

    decompress(buffer) {
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
                    this.result = zstd.decompressSync(buffer)
                    return this.result.toString()
                } catch (err) {
                    this.compression = 'text'
                    return buffer.toString()
                }
            }
        }
    }

    compress(data) {
        try {
            if(this.compression === 'gzip') {
                this.compressed = zlib.gzipSync(data)
                return this.compressed
             } else if (this.compression = 'brotli') {
                this.compressed = zlib.brotliCompressSync(data)
                return this.compressed
             } else if (this.compression = 'zstd') {
                this.compressed = zstd.compressSync(data)
                return this.compressed
             } else {
                return data.toString()
            }
        } catch (err) {
            throw new Error(`Compression error: ${err.message}`)
        }
    }
}