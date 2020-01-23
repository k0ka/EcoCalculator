import React, {Fragment} from 'react';
import AddSkill from './add-skill';
import Skill from './skill';
import Row from 'react-bootstrap/Row';

/**
 * Skills list block
 */
export default class Skills extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddSkill = this.handleAddSkill.bind(this);
        this.handleRemoveSkill = this.handleRemoveSkill.bind(this);
        this.handleChangeSkill = this.handleChangeSkill.bind(this);
    }

    handleAddSkill(skillName) {
        this.props.onAddSkill(skillName);
    }

    handleRemoveSkill(skillName) {
        this.props.onRemoveSkill(skillName);
    }

    handleChangeSkill(skillName, skillData){
        this.props.onChangeSkill(skillName, skillData);
    }

    render(){
        const localization = this.props.localization;
        const skillsSorted = this.props.skills.keySeq()
            .sort(function(a, b){
                return localization[a].localeCompare(localization[b]);
            });

        return (
            <Fragment>
                <Row className="m-1 mb-3 justify-content-center">
                    <AddSkill
                        skills={this.props.allSkills}
                        localization={this.props.localization}
                        onAddSkill={this.handleAddSkill} />
                </Row>

                {skillsSorted.map((skillName) =>
                    <Skill
                        key={skillName}
                        skillName={skillName}
                        skillData={this.props.skills.get(skillName)}
                        localization={this.props.localization}
                        onChangeSkill={this.handleChangeSkill}
                        onRemoveSkill={this.handleRemoveSkill}

                    />
                )}
            </Fragment>
        )
    }
}
