import React from 'react';
import Ingredients from './ingredients';
import Results from './results';
import Skills from './skills';
import Language from './language';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Map, Set } from 'immutable';

/**
 * Main app
 */
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);

        this.handleAddSkill = this.handleAddSkill.bind(this);
        this.handleRemoveSkill = this.handleRemoveSkill.bind(this);
        this.handleChangeSkill = this.handleChangeSkill.bind(this);

        this.handlePriceChanged = this.handlePriceChanged.bind(this);

        this.handleAddRecipe = this.handleAddRecipe.bind(this);
        this.handleRemoveRecipe = this.handleRemoveRecipe.bind(this);

        const allSkills = {};
        Object.keys(props.config.Recipes).forEach(recipe => {
            if(typeof props.config.Recipes[recipe].skill === 'undefined')
                return;

            allSkills[props.config.Recipes[recipe].skill] = 1;
        });

        const languages = Object.keys(this.props.config.Localization);

        this.state = {
            selectedRecipes: Map(),
            restRecipes: Object.keys(this.props.config.Recipes),
            allSkills: Object.keys(allSkills),
            skills: Map(),
            ingredients: {},
            languages: languages,
            language: languages[0],
            localization: this.props.config.Localization[languages[0]],
        }
    }

    /**
     * On changing language
     */
    handleLanguageChange(language) {
        this.setState({
            language: language,
            localization: this.props.config.Localization[language]
        });
    }

    /**
     * On adding single recipe
     */
    handleAddRecipe(recipe) {
        this.setState((state, props) => {
            const index = state.restRecipes.indexOf(recipe);
            if (index < 0)
                return {};

            return {
                selectedRecipes: state.selectedRecipes.update(
                    props.config.Recipes[recipe].result,
                    (val = Map()) => val.set(recipe, 0)
                ),
            };
        });

        this.setState(this.updateRecipes);
        this.setState(this.updatePrices);
    }

    /**
     * On adding all recipes with specified skill
     */
    handleAddSkill(skillName) {
        if(typeof skillName === 'undefined')
            return;

        this.setState((state, props) => {
            let selectedRecipes = state.selectedRecipes;
            const recipes = props.config.Recipes;

            state.restRecipes
                .filter(recipe => recipes[recipe].skill === skillName)
                .forEach(recipe => {
                    selectedRecipes = selectedRecipes.update(
                        recipes[recipe].result,
                        (val = Map()) => val.set(recipe, 0)
                    );
                });

            return {selectedRecipes: selectedRecipes};
        });
        this.setState(this.updateRecipes);
        this.setState(this.updatePrices);
    }

    /**
     * On removing all recipes with specified skill
     */
    handleRemoveSkill(skillName) {
        if(typeof skillName === 'undefined')
            return;

        this.setState((state, props) => {
            return {selectedRecipes:
                    state.selectedRecipes
                        .map((recipes) => recipes.filterNot((price, recipe) => props.config.Recipes[recipe].skill === skillName))
                        .filter((recipes) => recipes.size > 0)
            };
        });
        this.setState(this.updateRecipes);
        this.setState(this.updatePrices);
    }


    /**
     * On removing recipe
     */
    handleRemoveRecipe(recipe) {
        const recipes = this.props.config.Recipes;

        if(this.state.selectedRecipes.has(recipe)){
            // it's result item
            this.setState({
                selectedRecipes: this.state.selectedRecipes.delete(recipe)
            });
        } else {
            // it's recipe
            this.setState({
                selectedRecipes: this.state.selectedRecipes.update(
                    recipes[recipe].result,
                    (val = Map()) => val.delete(recipe))
                    .filter(val => val.size > 0)
            });
        }
        this.setState(this.updateRecipes);
        this.setState(this.updatePrices);
    }

    /**
     * Updates skills & ingredients for selected recipes
     */
    updateRecipes(state, props){
        const selectedRecipes = state.selectedRecipes;

        const newRestRecipes =
            Object.keys(props.config.Recipes)
            .filter(recipe => !selectedRecipes.get(props.config.Recipes[recipe].result, Map()).has(recipe));

        let usedSkills = Set().withMutations(usedSkills => {
            selectedRecipes.valueSeq().forEach((recipes) => {
                recipes.keySeq().forEach((recipe) => {
                    const skillName = props.config.Recipes[recipe].skill;
                    if(typeof skillName === 'undefined')
                        return;

                    usedSkills.add(skillName);
                });
            });
        });

        const newIngredients = {};
        selectedRecipes.valueSeq().forEach((recipes) => {
            recipes.keySeq().forEach((recipe) => {
                Object.keys(props.config.Recipes[recipe].ingredients).forEach((ingredient) => {
                    newIngredients[ingredient] = (typeof state.ingredients[ingredient] !== 'undefined') ? state.ingredients[ingredient] : 0;
                });
            });
        });

        selectedRecipes.keySeq().forEach((result) => {
            delete newIngredients[result];
        });

        return {
            restRecipes: newRestRecipes,
            skills: state.skills
                .filter((skillData, skillName) => usedSkills.has(skillName))
                .withMutations((skills) => {
                    usedSkills.toSeq().forEach((skillName) => {
                        if(skills.has(skillName))
                            return;

                        skills.set(skillName, Map({'value': 0, 'lavish': false}));
                    });
                }),
            ingredients: newIngredients
        };
    }

    /**
     * When user updates skill value
     */
    handleChangeSkill(skillName, skillData){
        let skillValue = parseInt(skillData.get('value'));
        if(isNaN(skillValue)){
            skillValue = 0;
        }

        if(skillValue < 0){
            skillValue = 0;
        }

        if(skillValue >= 10){
            skillValue = skillValue % 10;
        }

        if(skillValue > 7){
            skillValue = 7;
        }

        let lavishValue = skillData.get('lavish');
        if(skillValue < 6) {
            lavishValue = false;
        }

        this.setState((state) => {
            if(skillValue >= 6 && state.skills.get(skillName).get('value') < 6 ){
                lavishValue = true;
            }

            return {
                skills: state.skills
                    .setIn([skillName, 'value'], skillValue)
                    .setIn([skillName, 'lavish'], lavishValue)
            };
        });
        this.setState(this.updatePrices);
    }

    /**
     * When user updates ingredient price
     */
    handlePriceChanged(ingreident, price){
        const newIngredient = {};
        Object.assign(newIngredient, this.state.ingredients);

        price = price.replace(",", ".");
        if(isNaN(parseFloat(price))){
            newIngredient[ingreident] = 0;
        } else {
            newIngredient[ingreident] = price;
        }

        this.setState({
            ingredients: newIngredient
        });
        this.setState(this.updatePrices);
    }

    updatePrices(state, props){
        const ingredientPrices = {};
        const talents = {};
        const skills = {};

        state.skills.entrySeq().forEach(([skillName, skillData]) => {
            skills[skillName] = skillData.get('value');
            const talentName = skillName.substring(0, skillName.length - 5)  + "LavishResourcesTalent";
            talents[talentName] = skillData.get('lavish');
            //console.log(skillData.get('lavish'));
        });

        Object.keys(state.ingredients).forEach(ingredient => {
            ingredientPrices[ingredient] = parseFloat(state.ingredients[ingredient]);
        });

        let makeWork = true;
        let tries = 0;
        let selectedRecipes = state.selectedRecipes;
        while(makeWork){
            makeWork = false;
            tries++;
            if(tries > 100){
                console.log("Too much iterations in calculation");
                return;
            }

            state.selectedRecipes.valueSeq().forEach((recipes) => {
                recipes.keySeq().forEach((recipe) => {
                    let allIngredientsKnown = true;
                    let price = 0;
                    Object.keys(props.config.Recipes[recipe].ingredients).forEach((ingredient) => {
                        if(typeof ingredientPrices[ingredient] === 'undefined'){
                            allIngredientsKnown = false;
                            return;
                        }

                        price += ingredientPrices[ingredient] * props.config.Recipes[recipe].ingredients[ingredient](skills, talents);
                    });

                    if(!allIngredientsKnown)
                        return;

                    price /= props.config.Recipes[recipe].quantity(skills, talents);

                    const product = props.config.Recipes[recipe].result;
                    selectedRecipes = selectedRecipes.setIn([product, recipe], price);

                    if(typeof ingredientPrices[product] !== 'undefined' && ingredientPrices[product] <= price)
                        return;

                    ingredientPrices[product] = price;
                    makeWork = true;
                });
            });
        }

        return {
            selectedRecipes: selectedRecipes
        };
    }

    render(){
        let containerStyle = {
            'margin-bottom': '65px'
        };

        return(
            <Container style={containerStyle}>
                <Row>
                    <Col xs="auto">
                        <h1>Eco production calculator for ver {this.props.config.Version}</h1>
                    </Col>
                    <Col>
                        <Language
                            selected={this.state.language}
                            languages={this.state.languages}
                            onChange={this.handleLanguageChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={4} className="border mr-1">
                        <h2 className="text-center">Skills</h2>
                        <Skills
                            allSkills={this.state.allSkills}
                            skills={this.state.skills}
                            localization={this.state.localization}
                            onChangeSkill={this.handleChangeSkill}
                            onAddSkill={this.handleAddSkill}
                            onRemoveSkill={this.handleRemoveSkill}
                        />

                    </Col>
                    <Col xs={3} className="border mr-1">
                        <h2 className="text-center">Ingredient prices</h2>
                        <Ingredients
                            ingredients={this.state.ingredients}
                            localization={this.state.localization}
                            onPriceChanged={this.handlePriceChanged} />
                    </Col>
                    <Col className="border">
                        <h2 className="text-center">Output prices</h2>
                        <Results
                            results={this.state.selectedRecipes}
                            restRecipes={this.state.restRecipes}
                            localization={this.state.localization}
                            onRemoveRecipe={this.handleRemoveRecipe}
                            onAddRecipe={this.handleAddRecipe}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}
