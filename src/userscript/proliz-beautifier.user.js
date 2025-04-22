// ==UserScript==
// @name         Proliz Beautifier Extension
// @namespace    https://berikai.dev/
// @version      2025-04-20
// @description  Proliz CSS Beautifier Extension
// @author       Berikai
// @include      https://obs.*.edu.tr/*
// @include      https://obsapp.*.edu.tr/*
// @include      https://obsyeni.*.edu.tr/*
// @include      https://sis.*.edu.tr/*
// @include      https://bilsis.*.edu.tr/*
// @include      https://ogrenciweb.*.edu.tr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tr
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function manipulateCSS(content) {
        const addition = `@import url(https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap);table>tbody>tr>td,table>tbody>tr>td>span,table>tbody>tr>th{font-family:Roboto,Tahoma,Geneva,Verdana,sans-serif!important}.main-header,.main-sidebar{background-color:#262626}body,table>tbody>tr>td,table>tbody>tr>td>span,table>tbody>tr>th{line-height:2.4;letter-spacing:.6px}a.btn-xs.text-nowrap{min-width:10px!important}a.btn-xs#btnLogin{min-width:20px!important;min-height:16px!important;align-content:center}a.btn-xs{min-width:130px!important;min-height:30px!important;align-content:center}button.btn-xs{height:31px;min-width:42px;padding-left:12px}.info-box{padding:10px;align-items:center;height:110px!important}.info-box-content{line-height:1.2!important}div>div.info-box-content>span{line-height:1.4!important}table>tbody>tr>td{padding:7px 20px!important;font-weight:500}table>tbody>tr>th{padding-left:15px!important;font-weight:500}table>tbody>tr>th>a{white-space:nowrap}table>tbody>tr>td>span{padding-top:7px!important;padding-bottom:7px!important;font-weight:400}.main-header{display:flex;padding-left:25px;align-items:start}.elevation-4{box-shadow:none!important}.logo-xl{padding-top:5%!important;padding-left:40%!important;left:0!important;top:10!important}.fa,.fal{width:16px;padding-right:30px}.fas{margin-top:4px}.fa-square:before{content:"\\f061"!important}.user-panel{border-bottom:1px solid #dbdbdb!important}.brand-text{font-weight:600!important}body{height:100%;color:#000!important;font-family:Roboto,Tahoma,Geneva,Verdana,sans-serif;font-weight:500;margin:0;padding-right:0!important}`;
        return content + addition
    }

    // If the URL contains 'obs.izmirekonomi.edu.tr', we need to modify the logo, because current one looks so bad
    if(window.location.href.includes('obs.izmirekonomi.edu.tr')) {
        for(let img_element of document.getElementsByTagName('img')) {
            const src = img_element.getAttribute('src') ?? ''
            if(src.includes('uni_logo.gif')) {
                img_element.setAttribute('src', 'https://analytics.ieu.edu.tr/sinav_programi/Theme/assets/img/favicon.ico');
            }
        }

        for(let img_element of document.getElementsByTagName('input')) {
            const src = img_element.getAttribute('src') ?? ''
            if(src.includes('uni_logo.gif')) {
                img_element.setAttribute('src', 'https://analytics.ieu.edu.tr/sinav_programi/Theme/assets/img/favicon.ico');
            }
        }
    }

    // Manipulate the CSS
    // We need to load the CSS file from the Proliz itself and then manipulate it
    for(let link_element of document.getElementsByTagName('link')) {
        const href = link_element.getAttribute('href') ?? ''
        if(link_element.getAttribute('type') == 'text/css' && href.includes('/oibs18.css')) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: window.location.origin + '/' + href,
                onload: (ev) =>
                {
                    let e = document.createElement('style')
                    e.innerText = manipulateCSS(ev.responseText)
                    e.setAttribute('type', 'text/css')
                    document.head.appendChild(e)
                }
            });

            link_element.remove()
        }
    }
})();