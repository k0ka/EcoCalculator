import React from 'react';
import Calculator from "./calculator";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import * as config from '../config.json';
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

/**
 * Main app
 */
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleExportOpen = this.handleExportOpen.bind(this);
        this.handleExportClose = this.handleExportClose.bind(this);
        this.handleImportOpen = this.handleImportOpen.bind(this);
        this.handleImportClose = this.handleImportClose.bind(this);

        this.state = {
            error: null,
            isLoaded: false,
            config: [],
            exportOpened: false,
            importOpened: false
        };
    }

    handleExportOpen() {
        this.setState({exportOpened: true});
    }

    handleExportClose() {
        this.setState({exportOpened: false});
    }

    handleImportOpen() {
        this.setState({importOpened: true});
    }

    handleImportClose() {
        this.setState({importOpened: false});
    }

    componentDidMount() {
        fetch(config.default, {mode: 'no-cors'})
            .then(res => res.json())
            .then(
                (result) => {
                    Object.keys(result['Recipes']).map(function(recipeName){
                        const recipeData = result['Recipes'][recipeName];
                        recipeData['quantity'] = new Function('skills', 'talents', 'return ' + recipeData['quantity']);
                        Object.keys(recipeData['ingredients']).map(function(ingredientName){
                            recipeData['ingredients'][ingredientName] =
                                new Function('skills', 'talents', 'return ' + recipeData['ingredients'][ingredientName]);
                        });
                    });
                    this.setState({
                        isLoaded: true,
                        config: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            );
    }

    render() {
        const { error, isLoaded } = this.state;

        let content =
            error ? (<div>Error: {error.message}</div>) :
            !isLoaded ? (<div>Loading...</div>) :
                (<Calculator
                    exportOpened={this.state.exportOpened}
                    importOpened={this.state.importOpened}
                    onExportClose={this.handleExportClose}
                    onImportClose={this.handleImportClose}
                    config={this.state.config}/>);

        const containerStyle = {
            'marginBottom': '65px'
        };

        return (
            <Container style={containerStyle}>
                {content}
                <Navbar bg="primary" variant="dark" fixed="bottom">
                    <Nav className="justify-content-start">
                        <Button variant="outline-light mx-1" onClick={this.handleExportOpen}>
                            Export
                        </Button>
                        <Button variant="outline-light mx-1" onClick={this.handleImportOpen}>
                            Import
                        </Button>
                    </Nav>
                    <Nav className="justify-content-end ml-auto">
                        <Nav.Link href="https://github.com/k0ka/EcoCalculator/issues">Report a bug</Nav.Link>
                        <Nav.Link href="https://github.com/k0ka/EcoCalculator">View the source</Nav.Link>
                        <Nav.Link href="https://github.com/k0ka">by Koka</Nav.Link>
                    </Nav>
                </Navbar>
            </Container>
        );

    }
}
