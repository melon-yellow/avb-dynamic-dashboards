
/*
##########################################################################################################################
*/

// Imports
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

// Modules
import * as canvasDisplay from './functions/canvas-display'
import * as chartFunctions from './functions/chart-functions'
import * as dropdownLegend from './functions/dropdown-legend'
import * as resizeFonts from './functions/resize-fonts'

// Types
import {
    DatasetCollection,
    DynamicLayout
} from './types'

/*
##########################################################################################################################
*/

const datasets: DatasetCollection = {}
const layout: DynamicLayout = {}

/*
##########################################################################################################################
*/

const checkLayout = (
    current: DynamicLayout, newLayout: DynamicLayout
) => (JSON.stringify(current) != JSON.stringify(newLayout))

/*
##########################################################################################################################
*/

const writeLayout = (thislayout, location, ref) => {
    for (let i = 0; i < thislayout.length; i++) {
        let rtrn = await window.page.main.dyn.fillPage(thislayout[i], i, location, ref);
        let nextlayout = thislayout[i].content;
        let nextlocation = document.getElementById(rtrn.id);
        if (nextlayout != null) {
            //calls itself
            let rec = await writeLayout(nextlayout, nextlocation, rtrn.ref);
        };
    };
}

/*
##########################################################################################################################
*/

async function fill() {
    // Get Page Title
    const containerTitle = document.getElementById('containerTitle')?.innerHTML
    // Get Page Container
    const PageContainer = document.querySelector('#pageContainer')
    // Add Title to Page Container
    ReactDOM.render(
        React.createElement(() => (
            <div
                id="containerTitle"
                className={[
                    'container-title',
                    'align-items-center',
                    'font-weight-bold',
                    'text-dark'
                ].join(' ')}
            >{containerTitle}</div>
        )),
        PageContainer
    )
    // Run Fill Page Function
    let location = document.getElementById("pageContainer")
    window.page.main.dyn.show["done"] = true;
    return await writeLayout(layout, PageContainer);
}

/*
##########################################################################################################################
*/

//Show Values Function
export async function render(layout: unknown) {

    let timestamp = await window.page.aux.timestamp();
    let urlDatasets = window.page.header.url + "dash/datasets.json?timestamp=" + timestamp;

    //Get Function (getJSON)
    let datasets_index = await axios.get(urlDatasets);
    let data = await axios.get(urlLayout);

    //Create Layout Object
    window.page.layout = data.layout;
    //Create Cards Object
    window.page.cards = (window.page.cards == null) ?
        new Array() : window.page.cards;

    let conditions = 0;
    let count = await window.page.main.dyn.show.countChanges(window.page.layout);
    conditions += (count.cards != window.page.cards.length) ? 1 : 0;
    conditions += count.changes;
    let dataset_names = count.datasets;

    let directories = new Array();
    for (let u = 0; u < dataset_names.length; u++) {
        let item = dataset_names[u];
        if (datasets_index[item] != null) {
            if (!directories.includes(datasets_index[item]["dir"])) {
                directories[directories.length] = datasets_index[item]["dir"];
            };
        };
    };

    let datasets = new Object();
    for (let u = 0; u < directories.length; u++) {
        let dir = directories[u];
        let urlData = window.page.header.url + dir + "/data.json?timestamp=" + timestamp;
        let thisDataset = await axios.get(urlData);
        datasets = Object.assign(datasets, thisDataset);
    };

    if (window.page.datasets != null) {
        for (let item in datasets) {
            let matriz = datasets[item].data;
            if (window.page.datasets[item] != null) {
                let thisdata;
                if (Array.isArray(matriz)) {
                    for (let da = 0; da < matriz.length; da++) {
                        if (Array.isArray(matriz[da])) {
                            for (let dt = 0; dt < matriz[da].length; dt++) {
                                thisdata = window.page.datasets[item].data[da][dt];
                                if (matriz[da][dt] != thisdata) {
                                    conditions += 1;
                                };
                            };
                        } else {
                            thisdata = window.page.datasets[item].data[da];
                            if (matriz[da] != thisdata) {
                                conditions += 1;
                            };
                        };
                    };
                } else {
                    thisdata = window.page.datasets[item].data;
                    if (matriz != thisdata) {
                        conditions += 1;
                    };
                };
            } else {
                conditions += 1;
            };
        };
    } else {
        conditions += 1;
    };

    //Defines the Datasets
    window.page.datasets = datasets;

    let first = false;
    if(window.page.main.dyn.show["done"] == null){
        first = true;
        conditions += 1;
    };

    if (conditions > 0) {
        //Fill All Function
        if (count.cards != window.page.cards.length || count.changes > 0 || first) {
            let fal = await window.page.main.dyn.show.fillAll();
        };
        //Fill Card Function
        for (let i = 0; i < count.cards; i++) {
            let fcd = await window.page.main.dyn.fillCard(i);
        };
    };

    let rsf = await window.page.main.dyn.misc.resizeFonts();

}

/*
##########################################################################################################################
*/
