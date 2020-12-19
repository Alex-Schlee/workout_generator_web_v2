import React from 'react';
import './App.css';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';

const MUSCLE_GROUPS = ['Chest','Back','Shoulders','Legs','Arms','Random']
const _ = require('lodash');

class Configurations extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        templates : [],
        templateList: []
      } 
    }
  
    renderDropdownList(list){
      const templates = list;
      const dropdownItems = templates.map((item) =>
        <Dropdown.Item key={item} onClick={() => this.props.updateSelectedTemplate(item)}>
          {item}
        </Dropdown.Item>
      );
      return(
      <Dropdown.Menu>
        {dropdownItems}
      </Dropdown.Menu>
      )
    }
  
    render(){
      return(
      <Card>
        <Row>
          <Col>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-template-button">{this.props.selectedTemplateId}</Dropdown.Toggle>
              {this.renderDropdownList(this.props.templateIds)}
            </Dropdown>
          </Col>
  
          <Col>
          </Col>
  
          <Col>
            <Button onClick={() => this.props.onBuildWorkoutClick()}>Build Workout</Button>
          </Col>
        </Row> 
        <Row>
            <Col>
            <Template selectedTemplateTree={this.props.selectedTemplateTree}
                        firestore={this.props.firestore} />
            </Col>
        </Row>
      </Card>
      )
    }
  }
  
  class Template extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            focusList: []
        }
    }

    renderTemplateSections(selectedTemplateTree){
        const sections = _.omit(selectedTemplateTree, ['equipmentList']);
        const sectionItems = Object.keys(sections).map((key) => 
            <ListGroup.Item key={key}>
                {key}
                {this.renderTemplateComponents(sections[key], key)}
            </ListGroup.Item>
        );
        return(
            <Accordion>
                <Card>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Show Template
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <ListGroup key="TemplateListGroup">
                            {sectionItems}
                        </ListGroup>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }



    

    renderTemplateComponents(component, key){
        const components = component;
        console.log(this.props.selectedTemplateTree[key]);

        function RenderDropdownList(){
          const dropdownItems = MUSCLE_GROUPS.map((item) =>
            <Dropdown.Item key={item}>
              {item}
            </Dropdown.Item>
          );
          return(
          <Dropdown.Menu>
            {dropdownItems}
          </Dropdown.Menu>
          )
        }

        return(
          <Card>
          <Table striped bordered hover>
              <thead>
                  <tr key="templateTableHeaders">
                      <th>Muscle Group</th>
                      <th>Specific Exercise</th>
                      <th>Secondaries</th>
                  </tr>
              </thead>
              <tbody>
                  {components.map(function(item, i){
                    return(
                      <tr key={i}>
                        <td>
                        <Dropdown>
                            <Dropdown.Toggle id="focusListDropdown" key="focusListDropdown">{item.muscleGroup.length > 0 ? item.muscleGroup : 'Random'}</Dropdown.Toggle>
                            {RenderDropdownList()}                        
                        </Dropdown>
                        </td>
                        <td>{item.exerciseName}</td>
                        <td>{item.secondaries}</td>
                      </tr>
                      )
                  })}
              </tbody>
          </Table>
      </Card>
        )
    }


  
    render(){
      return(
        <Card>
          {this.renderTemplateSections(this.props.selectedTemplateTree)}
        </Card>
      )
    }
  }

  export default Configurations