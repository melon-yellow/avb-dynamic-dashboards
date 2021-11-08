//JQuery Main Function
(async($) => {
    "use strict";
    //Global DOM Object
    window.page = new Object();
    //Store Headers
    window.page.header = (window.page.header == null) ? {
        url: document.getElementById("url").getAttribute("href"),
        dir: document.getElementById("dir").getAttribute("content"),
        key: document.getElementById("key").getAttribute("content"),
        time: document.getElementById("time").getAttribute("content")
    } : window.page.header;
    //Auxiliary Functions
    window.page.aux = (window.page.aux == null) ? Object.assign(
        new Object(), await import(
            window.page.header.url +
            "js/modules/methods.js?timestamp=" +
            window.page.header.time
        )
    ) : window.page.aux;
    //Main Code
    window.page.main = (window.page.main == null) ? {
        nav: await window.page.aux.importTree("js/modules/nav-title.js"),
        dyn: await window.page.aux.importTree("js/modules/dynamic-page.js"),
        snv: await window.page.aux.importTree("js/modules/sidenav.js"),
        execute: async() => {
            return {
                nav: await window.page.main.nav.navTitle(),
                tgg: await window.page.main.snv.sidenavFunctions(),
                dyn: await window.page.main.dyn.dynamicPage()
            }
        }
    } : window.page.main;
    //Main Execute
    return await window.page.main.execute();
})(jQuery);