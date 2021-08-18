import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";
import $ from 'jquery';
import pack from '../package.json';
import axios from 'axios';

let listeners = [],
    doc = window.document,
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
    observer;

const DOMElementReady = (selector, fn) => {
    listeners.push({
        selector: selector,
        fn: fn
    });
    if (!observer) {
        observer = new MutationObserver(checkState);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    checkState();
}

const checkState = () => {
    for (let i = 0, len = listeners.length, listener, elements; i < len; i++) {
        listener = listeners[i];
        elements = doc.querySelectorAll(listener.selector);
        for (let j = 0, jLen = elements.length, element; j < jLen; j++) {
            element = elements[j];
            if (!element.ready) {
                element.ready = true;
                listener.fn.call(element, element);
            }
        }
    }
}

window.DOMElementReady = DOMElementReady;

const datasetToObject = (elem) => {
    let data = {};
    [].forEach.call(elem.attributes, function (attr) {
        if (/^data-/.test(attr.name)) {
            let camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
            data[camelCaseName] = attr.value;
        }
    });
    return data;
}

let itComesFromQuote = null;

if (window.localStorage.getItem('raq-object') !== null) {
    itComesFromQuote = {
        status: true,
        data: JSON.parse(window.localStorage.getItem('raq-object'))
    }
} else {
    itComesFromQuote = {
        status: false,
        data: null
    }
}

$(document).ready(function () {
    const scriptTag = document.getElementById('raq-app-script');

    let aHrefButtons = $('.button');
    let aHrefButtonSizes = $('.button').length;

    for (let i = 0; i < aHrefButtonSizes; i++) {
        if (aHrefButtons[i].textContent.trim().match(/Proceed to Checkout/ig) !== null) {
            $(`<div id="raq-app"></div>`).insertAfter(aHrefButtons[i])
        }
    }

    const accessToken = datasetToObject(scriptTag).accessToken;
    let apiUrl = null;
    axios.get(`https://raq-auth-api-server.herokuapp.com/client/${accessToken}`)
        .then(response => {
            if (response.data.success) {
                apiUrl = response.data.data[0].apiUrl;
                return apiUrl
            }else {
                return null
            }
        }).then((url) => {
        if (url !== null) {
            console.log(`%c🟠 Request a Quote Application by [Optimum7] v${pack.version}`, 'font-size: 12px; color:#ff6600; font-weight:bold;');
            const Application = document.getElementById('raq-app');
            ReactDOM.render(<App args={datasetToObject(scriptTag)} apiUrl={url}
                                 itComesFromQuote={itComesFromQuote}/>, Application);
        } else {
            console.log(`%cClient API Access Token is not valid.`,'color:#ff0000;font-weight:bold;');
        }

        })
        .catch((err)=> {
            console.log(`%cAPI Server Error `,'color:#ff0000;font-weight:bold;',err);
        })

})
