import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Typeahead} from 'react-bootstrap-typeahead';

/**
 * Add recipe component
 */
export default class AddRecipe extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: null,
        };
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.value == null)
            return;

        this.props.onAddRecipe(this.state.value);
        this.refs.typeahead.getInstance().clear()
    }

    handleChange(selected){
        this.setState({
            value: selected[0].id
        });
    }

    render() {
        const localization = this.props.localization;
        const options = this.props.recipes
            .map(function(value){
                return {id:value, label: localization[value]};
            })
            .sort(function(a, b){
                return a.label.localeCompare(b.label);
            });

        return (
            <Form inline={true} onSubmit={this.handleSubmit}>
                <Col xs={9}>
                    <Typeahead
                        id="add-recipe"
                        ref="typeahead"
                        options={options}
                        onChange={this.handleChange}
                        placeholder="Choose a recipe..."
                    />
                </Col>
                <Col xs={3}>
                    <Button type="submit" variant="primary">Add</Button>
                </Col>
            </Form>
        );
    }
}
