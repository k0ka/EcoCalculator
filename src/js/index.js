import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import App from './app';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

ReactDOM.render(
    <div>
        <App config={Config[0]}/>
        <Navbar bg="primary" variant="dark" fixed="bottom">
            <Nav className="justify-content-end ml-auto">
                <Nav.Link href="https://github.com/k0ka">by Koka</Nav.Link>
            </Nav>
        </Navbar>
    </div>
    ,
    document.getElementById('root')
);

/**
 * @return {number}
 */
window.Operation_Multiply = function (a, b){
    return a*b;
};