import 'dotenv/config.js';
import { JSDOM } from 'jsdom';

export default (_app) => ({
    type: 'response',
    name: 'Main Page Button URLs Fixer',
    description: 'This plugin fixes the main page button URLs',
    author: 'Berikai',
    enabled: true,
    function: (_proxyRes, req, _res, content, editor) => {
        if(req.url.endsWith('/')) {
            const dom = new JSDOM(content);      
            const document = dom.window.document;  

            for(let a of document.querySelectorAll('a')) {
                if(a.href.includes('/oibs/std/login.aspx')) {
                    a.href = process.env.PROXY_PUBLIC_URL + '/oibs/std/login.aspx'
                }
                if(a.href.includes('/oibs/acd/login.aspx')) {
                    a.href = process.env.PROXY_PUBLIC_URL + '/oibs/acd/login.aspx'
                }
                if(a.href.includes('/oibs/login.aspx')) {
                    a.href = process.env.PROXY_PUBLIC_URL + '/oibs/login.aspx'
                }
            }

            const updatedContent = dom.serialize()
            editor(updatedContent)
        } 
    }
})