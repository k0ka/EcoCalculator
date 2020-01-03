import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

/**
 * Skill + talent block
 */
export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeSkill = this.handleChangeSkill.bind(this);
        this.handleRemoveSkill = this.handleRemoveSkill.bind(this);
        this.handleChangeLavish = this.handleChangeLavish.bind(this);
    }

    handleChangeSkill(e){
        e.preventDefault();
        this.props.onChangeSkill(
            this.props.skillName,
            this.props.skillData.set('value', e.target.value)
        );
    }

    handleRemoveSkill(e){
        e.preventDefault();
        this.props.onRemoveSkill(this.props.skillName);
    }

    handleChangeLavish(e){
        e.preventDefault();
        const checked = e.target.checked;
        setTimeout(() => {
            this.props.onChangeSkill(
                this.props.skillName,
                this.props.skillData.set('lavish', checked)
            );
        }, 0);
    }

    render(){
        const skillName = this.props.skillName;
        const skillValue = this.props.skillData.get('value');
        const talentName = skillName.substring(0, skillName.length - 5)  + "LavishWorkspaceTalentGroup";

        return (
            <div>
                <Row className="my-1">
                    <Form.Label column xs={8} htmlFor={skillName}>
                        {this.props.localization[skillName]}
                    </Form.Label>

                    <Col xs="3">
                        <Form.Control
                            id={skillName}
                            min="0"
                            max="7"
                            value={skillValue}
                            onChange={this.handleChangeSkill} />
                    </Col>
                    <Col xs="1">
                        <button type="button" className="close" aria-label="Close" onClick={this.handleRemoveSkill}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Col>
                </Row>
                {
                    (skillValue >=6 ) &&
                    <Form.Group className="mb-3" controlId={talentName} key={talentName}>
                        <Form.Check
                            inline
                            custom
                            label={this.props.localization[talentName]}
                            type="checkbox"
                            checked={this.props.skillData.get('lavish')}
                            onChange={this.handleChangeLavish} />
                    </Form.Group>
                }
            </div>
        )
    }
}
