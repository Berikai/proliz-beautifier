import 'dotenv/config.js'
import express from 'express'

import router from './router.js'
import createProxy from './proxy/createProxy.js'

import oibs from './plugins/oibs.js'
import uniLogo from './plugins/uniLogo.js'
import mainPageButtons from './plugins/mainPageButtons.js'
import mainPageUniversitySelector from './plugins/mainPageUniversitySelector.js'

import universities from './universities.json' with { type: 'json' }

if (!process.env.PROXY_PUBLIC_URL) {
    console.error('Missing environment variable: PROXY_PUBLIC_URL')
    console.error('Please set it in the .env file or as environment variable.')
    process.exit(1)
}

const app = express()

const proxy = createProxy({
    target: 'https://' + universities[0], // Set a default target from universities.json's first entry
    url: process.env.PROXY_PUBLIC_URL,
    router: router,
    plugins: [
        oibs(app),
        uniLogo(app),
        mainPageButtons(app),
        mainPageUniversitySelector(app),
    ]
})

app.use('/', proxy)

app.listen(3000, () => {
    console.log('Proliz Beautifier Proxy Server is running on port 3000')
})