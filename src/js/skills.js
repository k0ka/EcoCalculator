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
                        onAddSkill={this.props.onAddSkill} />
                </Row>

                {skillsSorted.map((skillName) =>
                    <Skill
                        key={skillName}
                        skillName={skillName}
                        skillData={this.props.skills.get(skillName)}
                        localization={this.props.localization}
                        onChangeSkill={this.props.onChangeSkill}
                        onRemoveSkill={this.props.onRemoveSkill}
                    />
                )}
            </Fragment>
        )
    }
}
