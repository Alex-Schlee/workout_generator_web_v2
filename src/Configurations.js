import React from 'react';
import './App.css';

import Card from 'react-bootstrap/Card';
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
            <Template 
            selectedTemplateTree={this.props.selectedTemplateTree} 
            exercisesArray={this.props.exercisesArray}
            updateTemplateComponent={template => this.props.updateTemplateComponent(template)}
            />
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


    renderSpecificExerciseDropdownList(key, muscleGroup){
      const exercisesArray = this.props.exercisesArray;
      const exercises = _.filter(exercisesArray, function(item) {return item.muscleGroup === muscleGroup})
      const dropdownItems = exercises.map((item, i) =>
        <Dropdown.Item key={i} onClick={() => this.updateExerciseTemplate(key, i, item)}>
          {item.exerciseName}
        </Dropdown.Item>
      );
      return(
      <Dropdown.Menu key={muscleGroup}>
        {dropdownItems}
      </Dropdown.Menu>
      )
    }
    
    updateExerciseTemplate(key, i, item){
      var currentTemplate = this.props.exercisesArray;
      currentTemplate[key][i] = item;
      console.log(currentTemplate);
      this.props.updateTemplateComponent(currentTemplate);
    }

    renderTemplateComponents(component, key){
        const components = component;
        const exercisesArray = this.props.exercisesArray;
        const currentTemplate = this.props.selectedTemplateTree;
        console.log(currentTemplate);



        function UpdateMuscleGroupTemplate(key, i, item){
          console.log(i);
          currentTemplate[key][i]["muscleGroup"] = item;
          console.log(currentTemplate[key][i]["muscleGroup"]);
        }

        function RenderMuscleGroupDropdownList(key){
          const dropdownItems = MUSCLE_GROUPS.map((item, i) =>
            <Dropdown.Item key={i} onClick={() => UpdateMuscleGroupTemplate(key, i, item)}>
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
                      <th>{key}</th>
                  </tr>
              </thead>
              <tbody>
                  {components.map(function(item, i){
                    return(
                      <tr key={i}>
                        <td>
                        <Dropdown>
                            <Dropdown.Toggle id="muscleGroupDropdown" key="muscleGroupDropdown">{item.muscleGroup.length > 0 ? item.muscleGroup : 'Random'}</Dropdown.Toggle>
                            {RenderMuscleGroupDropdownList(key)}                        
                        </Dropdown>
                        {item.muscleGroup !== 'Random' &&
                          <Dropdown>
                              <Dropdown.Toggle id="specExDropdown" key="specExDropdown">{item.exerciseName.length > 0 ? item.exerciseName : 'Random'}</Dropdown.Toggle>
                              {typeof(item) !== undefined && this.renderSpecificExerciseDropdownList(key, item.muscleGroup)}                        
                          </Dropdown>
                        }
                        {item.secondaries}
                        </td>
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