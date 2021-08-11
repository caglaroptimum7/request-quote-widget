import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";

const Application = document.getElementById('raq-app');
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

let cartChange = null;

ReactDOM.render(<App args={datasetToObject(Application)} cartChange={cartChange}/>, Application);