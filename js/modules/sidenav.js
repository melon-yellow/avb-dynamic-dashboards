//Sidenav Toggle Function
export async function sidenavFunctions() {

    //Toggle function
    async function toggle() {
        $("body").toggleClass("sb-sidenav-toggled");
        return 0;
    };

    //Sync Scroll Function
    async function sync() {
        window.page.main.snv.scroll = (window.page.main.snv.scroll == null) ?
            0 : window.page.main.snv.scroll;
        let nowScroll = $(document).scrollTop();
        let prevScroll = window.page.main.snv.scroll;
        if (nowScroll != prevScroll) {
            let prevScroll = window.page.main.snv.scroll;
            let delta = nowScroll - prevScroll
            let sideScroll = $("div.sb-sidenav-menu").scrollTop();
            sideScroll += delta;
            if (sideScroll < 0) {
                sideScroll = 0;
            };
            let navSize = document.getElementById("navBar").offsetHeight;
            if (sideScroll > navSize) {
                sideScroll = navSize;
            };
            $("div.sb-sidenav-menu").scrollTop(sideScroll);
            window.page.main.snv.scroll = $(document).scrollTop();
        };
        return 0;
    };

    //Set Functions
    setTimeout(async() => {
        //Set Toggle Function
        document.getElementById("sidebarToggle").onclick = toggle;
        //Set Scroll Function
        document.getElementById("body").onscroll = sync;
    }, 0);

    return 0;

}; //End of Exported Function