import React, {Fragment} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * Selected result block
 */
export default class Result extends React.Component {
    handleRemoveRecipe(value, e){
        e.preventDefault();
        this.props.onRemoveRecipe(value);
    }

    render(){
        const localization = this.props.localization;
        const result = this.props.result;
        const prices = this.props.recipes.valueSeq().toArray();
        const resultPrice = Math.min(...prices);
        const sortedRecipes = this.props.recipes.entrySeq()
            .sort(function(a, b){
                return localization[a[0]].localeCompare(localization[b[0]]);
            });

        return (
            <Fragment>
                <Row className="my-1" key={result}>
                    <Col xs="7">
                        <label htmlFor={result}>
                            {this.props.localization[result]}
                        </label>
                    </Col>
                    <Col xs="4">
                        <input
                            className="form-control"
                            id={result}
                            value={Math.round(resultPrice * 100) / 100}
                            readOnly />
                    </Col>
                    <Col xs="1">
                        <button type="button" className="close" aria-label="Close" onClick={(e) => this.handleRemoveRecipe(result, e)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Col>
                </Row>
                {this.props.recipes.size > 1 && sortedRecipes.map(([recipe, price]) =>
                    <Row className="my-1" key={recipe}>
                        <Col xs="7">
                            <label className="pl-3" htmlFor={recipe}>
                                {this.props.localization[recipe]}
                            </label>
                        </Col>
                        <Col xs="4">
                            <input
                                className="form-control"
                                id={recipe}
                                value={Math.round(price * 100) / 100}
                                readOnly />
                        </Col>
                        <Col xs="1">
                            <button type="button" className="close" aria-label="Close" onClick={(e) => this.handleRemoveRecipe(recipe, e)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </Col>
                    </Row>
                )}
            </Fragment>
        )
    }
}
