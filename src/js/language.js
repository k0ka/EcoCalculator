import React from 'react';

/**
 * Language selector component
 */
export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        e.preventDefault();
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <div>
                <select className="custom-select" value={this.props.value} onChange={this.handleChange}>
                    {this.props.languages.map((value) =>
                        <option key={value} value={value}>{value}</option>
                    )}
                </select>
            </div>
        );
    }
}
