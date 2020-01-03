import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * Ingredient prices block
 */
export default class Ingredients extends React.Component {
    priceChanged(value, e){
        e.preventDefault();
        this.props.onPriceChanged(value, e.target.value);
    }

    render(){
        const localization = this.props.localization;
        const ingredientsSorted = Object.keys(this.props.ingredients)
            .sort(function(a, b){
                return localization[a].localeCompare(localization[b]);
            });

        return (
            <div>
            {ingredientsSorted.map((value) =>
                <Row className="my-1" key={value}>
                    <Col xs="8">
                        <label htmlFor={value} className="col-form-label">
                            {this.props.localization[value]}
                        </label>
                    </Col>

                    <Col xs="4">
                        <input step="any"
                               className="form-control"
                               id={value}
                               value={this.props.ingredients[value]}
                               onChange={(e) => this.priceChanged(value, e)} />
                    </Col>
                </Row>
            )}
            </div>
        )
    }
}
