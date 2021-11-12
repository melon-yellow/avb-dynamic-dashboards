//Navbar and Title Function
export async function navTitle() {

    //create objects
    let dat_this = new Object();
    let dat_that = new Object();
    let group = new Object();
    //Get path to this node
    let pathToThis = window.page.header.dir + "/main.php?action=route&path=this";
    dat_this = await window.page.aux.json(pathToThis);
    //get parent
    let pathToParent = window.page.header.dir + "/main.php?action=route&path=parent";
    dat_that = await window.page.aux.json(pathToParent);
    //Get path to child nodes
    let pathToChilds = window.page.header.dir + "/main.php?action=route&path=childs";
    group = await window.page.aux.json(pathToChilds);
    //check for first node
    if (dat_that.length < 1) { dat_that = dat_this };
    //check for end nodes
    if (group.length < 1) {
        let pathToBrothers = window.page.header.dir + "/main.php?action=route&path=brothers";
        group = await window.page.aux.json(pathToBrothers);
    };
    //Create TopNav Title
    document.getElementById("topNav").insertAdjacentHTML("beforeend",
        "<a id=\"" + dat_that["key"] + "\" " +
        "href=\"index.php?key=" + dat_that["key"] +
        "\" class=\"navbar-brand font-weight-bold\">" +
        dat_that["this"] + "</a>");
    //Create Navbar Items
    for (let item in group) {
        document.getElementById("navBar").insertAdjacentHTML("beforeend",
            "<a id=\"" + group[item]["key"] + "\" " +
            "href=\"index.php?key=" + group[item]["key"] +
            "\" class=\"nav-link\">" +
            group[item]["this"] +
            "</a>");
    };
    //Set this page title
    for (let item in group) {
        //if meta content is this data element
        if (window.page.header.key == group[item]["key"]) {
            // Add active state to sidebar nav links
            document.getElementById(group[item]["key"]).classList.add("active");
        };
    };
    //Creates the title of the page container
    document.getElementById("pageContainer").insertAdjacentHTML("beforeend",
        "<div class=\"container-title align-items-center font-weight-bold\" id=\"containerTitle\">" +
        dat_this["this"] +
        "</div>");

    //set minimum size of page as navSize + 100
    let navSize = document.getElementById("navBar").offsetHeight;
    document.getElementById("pageContainer").style.minHeight = String(navSize + 100) + "px";

}; //End of Exported Function