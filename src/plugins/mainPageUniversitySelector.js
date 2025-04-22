import 'dotenv/config.js'
import { JSDOM } from 'jsdom'
import universities from '../universities.json' with { type: 'json' }

export default (_app) => ({
    type: 'response',
    name: 'Main Page University Selector',
    description: 'This plugin enables university selection in the main page of Proliz',
    author: 'Berikai',
    enabled: true,
    function: (_proxyRes, req, _res, content, editor) => {
        if(req.url.endsWith('/')) {
            const dom = new JSDOM(content);      
            const document = dom.window.document;  

            if(req.headers.cookie) {
                const cookies = Object.fromEntries(req.headers.cookie.split('; ').map(cookie => cookie.split('=')))
                if (cookies['University'] == '' || cookies['University'] == undefined) {
                    document.querySelector('#imgUniLogo').remove()
                    document.querySelector('#lblUniAd').textContent = 'Proliz Beautifier'
                }
            } else {
                document.querySelector('#imgUniLogo').remove()
                document.querySelector('#lblUniAd').textContent = 'Proliz Beautifier'
            }
            
            const universitySelector = document.createElement('div')
            universitySelector.className = 'text-center pt-3'
            universitySelector.innerHTML = `<select onchange="document.cookie = 'University=' + this.value; window.location = window.location.href;" onfocus="this.selectedIndex = 0;" class="list-group-item list-group-item-info text-white col-sm-4 col-sm-offset-4 text-center" style="margin: auto">
            <option value="${universities[0]}">Üniversiteni seç</option>
            ${(() => {
                let university_options = ""

                for (let i = 0; i < universities.length; i++) {
                    const university = universities[i]
                    university_options += `<option value="${university}">${university}</option>`
                }

                return university_options
            })()}</select>`

            try {
                document.querySelector('#myContainer').prepend(universitySelector)

                const updatedContent = dom.serialize()
                editor(updatedContent)
            } catch (error) {
                console.error('Error while adding university selector:', error)
            }
        } 
    }
})