import fs from 'fs'

const minifyCSS = (css) => css
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/\/\*.*?\*\//g, '') // Remove comments
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around symbols
    .replace(/;}/g, '}'); // Remove unnecessary semicolons


export default (_app) => ({
    type: 'response',
    name: 'Proliz Theme Modifier',
    description: 'This plugin modifies the response of the oibsXX.css file on Proliz to change the look and feel',
    author: 'Berikai',
    enabled: true,
    function: (_proxyRes, req, _res, content, editor) => {
        const regex = /\/App_Themes\/oibs\d+\/oibs\d+\.css/;
        if (regex.test(req.url)) {
    
            const cssFilePath = 'src/css/oibs18.css';
            const cssContent = fs.readFileSync(cssFilePath, 'utf8');
            const sumContent = content + minifyCSS(cssContent);
    
            editor(sumContent);
        } 
    }
})