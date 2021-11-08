//Timestamp Function
export async function timestamp() {
    //Get actual time
    let newdate = new Date();
    //get a number representing the date
    let dateNumber = 10000 * newdate.getFullYear();
    dateNumber += 100 * (newdate.getMonth() + 1);
    dateNumber += 1 * newdate.getDate();
    //get a number representing the daytime
    let daytimeNumber = 10000 * newdate.getHours();
    daytimeNumber += 100 * newdate.getMinutes();
    daytimeNumber += 1 * newdate.getSeconds();
    //get actual timestamp
    return (String(dateNumber) + String(daytimeNumber));

}; //End of Exported Function

//Get JSON Function
export async function json(url) {
    return await new Promise((resolve, reject) => {
        $.getJSON(url, (obj) => { resolve(obj) })
		.catch((error) => { reject(error) });
    });
}; //End of Exported Function

//Import Function
export async function importTree(url) {
    let importUrl = window.page.header.url;
    importUrl += url + "?timestamp=" + window.page.header.time;
    return Object.assign(new Object(), await import(importUrl));
}; //End of Exported Function