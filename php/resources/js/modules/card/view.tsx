
/*
##########################################################################################################################
*/

// Imports
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

// Modules
import { fillCard } from './card'
import { fillPage } from './fill'
import { getElementByIdUnsafe } from '../utils'

import * as canvasDisplay from './functions/canvas-display'
import * as chartFunctions from './functions/chart-functions'
import * as dropdownLegend from './functions/dropdown-legend'
import * as resizeFonts from './functions/resize-fonts'

// Types
import {
    DatasetCollection,
    Children,
    Root
} from './types'

/*
##########################################################################################################################
*/

let layout: Root
let datasets: DatasetCollection

/*
##########################################################################################################################
*/

function checkLayout(current: Root, next: Root) {
    return JSON.stringify(current) !== JSON.stringify(next)
}

/*
##########################################################################################################################
*/

async function iterLayout<U extends string>(
    layout?: Children,
    ups?: U
) {
    if (!layout) throw new Error('invalid layout')
    for (let i = 0; i < layout.length; i++) {
        let rtrn = await fillPage(layout[i], i, location, ref);
        let nextlayout = thislayout[i].content;
        let nextlocation = document.getElementById(rtrn.id);
        if (nextlayout != null) {
            //calls itself
            let rec = await iterLayout(nextlayout, nextlocation, rtrn.ref);
        };
    };
}

/*
##########################################################################################################################
*/

function fill() {
    return ReactDOM.render(
        <div
            id="containerTitle"
            className={[
                'container-title',
                'align-items-center',
                'font-weight-bold',
                'text-dark'
            ].join(' ')}
        >{
            getElementByIdUnsafe('containerTitle').innerText
        }</div>,
        getElementByIdUnsafe('pageContainer')
    )
}

function write() {
    return iterLayout(layout?.body?.children, 'dyn')
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
            let fal = fill();
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
