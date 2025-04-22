import universities from './universities.json' with { type: 'json' }

export default (req) => {
    if (req.headers.cookie) {
        const cookies = Object.fromEntries(req.headers.cookie.split('; ').map(cookie => cookie.split('=')))
        if (universities.includes(cookies['University'])) {
            return 'https://' + cookies['University']
        }
        // Set the default base URL from the universities.json file's first entry
        // This is a fallback in case the cookie is not set or the university is not recognized
        return 'https://' + universities[0]
    }
}