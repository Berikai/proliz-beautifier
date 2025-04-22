import 'dotenv/config.js'
import universities from '../universities.json' with { type: 'json' }

const universityLogo = {
    'obs.izmirekonomi.edu.tr': 'https://analytics.ieu.edu.tr/sinav_programi/Theme/assets/img/favicon.ico'
}

export default (app) => ({
    type: 'response',
    name: 'IUE University Logo Plugin',
    description: 'This plugin modifies the university logo of IUE on Proliz',
    author: 'Berikai',
    enabled: true,
    function: (proxyRes, req, res, content, editor) => {
        const universityURL = 'obs.izmirekonomi.edu.tr'

        if(req.url.includes('/uni_logo.gif')) {
            if (req.headers.cookie) {
                const cookies = Object.fromEntries(req.headers.cookie.split('; ').map(cookie => cookie.split('=')))
                switch (cookies['University']) {
                    case universityURL:
                        res.redirect(universityLogo[universityURL])
                        break

                    case undefined:
                        if(universities[0] == universityURL) {
                            res.redirect(universityLogo[universityURL])
                        }
                        break
                    case '':
                        if(universities[0] == universityURL) {
                            res.redirect(universityLogo[universityURL])
                        }
                        break
                    
                    default:
                        // If the university is not in the list, redirect to the default logo
                        if(!universities.includes(cookies['University'])) {
                            res.redirect(universityLogo[universityURL])
                        }
                        break
                }
            } else {
                if(universities[0] == universityURL) {
                    res.redirect(universityLogo[universityURL])
                }
            }
        } 
    }
})