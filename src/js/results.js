import React, {Fragment} from 'react';
import AddRecipe from './add-recipe';
import Result from './result';
import Row from 'react-bootstrap/Row';

/**
 * Selected results block
 */
export default class Results extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const localization = this.props.localization;
        const sortedResults = this.props.results.entrySeq()
            .sort(function(a, b){
                return localization[a[0]].localeCompare(localization[b[0]]);
            });

        return (
            <Fragment>
                <Row className="m-1 mb-3 justify-content-center">
                    <AddRecipe
                        recipes={this.props.restRecipes}
                        localization={localization}
                        onAddRecipe={this.props.onAddRecipe}/>
                </Row>

                {sortedResults.map(([result, recipes]) =>
                    <Result
                        key={result}
                        result={result}
                        recipes={recipes}
                        localization={localization}
                        onRemoveRecipe={this.props.onRemoveRecipe}/>
                )}
            </Fragment>
        )
    }
}
