import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

/**
 * Import dialog component
 */
export default class ImportDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
          value: ''
        };
    }

    handleChange(e){
        e.preventDefault();
        let value = e.target.value;
        this.setState(() => {
            return {'value': value};
        });
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.onImport(this.state.value);
        this.props.onClose();
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Import configuration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        as="textarea"
                        onChange={this.handleChange}
                        value={this.state.value}
                        rows="5" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Import
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}