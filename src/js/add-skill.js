import React from 'react';
import Col from 'react-bootstrap/Col';
import {Typeahead} from 'react-bootstrap-typeahead';


/**
 * Add recipe component
 */
export default class AddSkill extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.typeahead = React.createRef();
    }

    handleChange(selected){
        this.props.onAddSkill(selected[0].id);
        this.typeahead.current.clear();
    }

    render() {
        const localization = this.props.localization;
        const options = this.props.skills
            .map(function(value){
                return {id:value, label: localization[value]};
            })
            .sort(function(a, b){
                return a.label.localeCompare(b.label);
            });

        return (
            <Col>
                <Typeahead
                    id="add-skill"
                    ref={this.typeahead}
                    options={options}
                    onChange={this.handleChange}
                    placeholder="Choose a skill..."
                />
            </Col>
        );
    }
}
