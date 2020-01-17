import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import App from './app';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

/**
 * @return {number}
 */
window.Operation_Multiply = function (a, b){
    return a*b;
};