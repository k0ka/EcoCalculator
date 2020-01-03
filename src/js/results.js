import React from 'react';
import AddRecipe from './add-recipe';
import Result from './result';
import Row from 'react-bootstrap/Row';

/**
 * Selected results block
 */
export default class Results extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddRecipe = this.handleAddRecipe.bind(this);
        this.handleRemoveRecipe = this.handleRemoveRecipe.bind(this);
    }

    handleRemoveRecipe(value){
        this.props.onRemoveRecipe(value);
    }

    handleAddRecipe(skill) {
        this.props.onAddRecipe(skill);
    }

    render(){
        const localization = this.props.localization;
        const sortedResults = this.props.results.entrySeq()
            .sort(function(a, b){
                return localization[a[0]].localeCompare(localization[b[0]]);
            });

        return (
            <div>
                <Row className="m-1 mb-3">
                    <AddRecipe
                        recipes={this.props.restRecipes}
                        localization={localization}
                        onAddRecipe={this.handleAddRecipe}/>
                </Row>

                {sortedResults.map(([result, recipes]) =>
                    <Result
                        key={result}
                        result={result}
                        recipes={recipes}
                        localization={localization}
                        onRemoveRecipe={this.handleRemoveRecipe}/>
                )}
            </div>
        )
    }
}
