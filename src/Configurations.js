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
            muscleGroupArray={this.props.muscleGroupArray}
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

  
    render(){
      return(
        <Card>
          <TemplateSection 
            selectedTemplateTree={this.props.selectedTemplateTree}
            exercisesArray={this.props.exercisesArray}
            muscleGroupArray={this.props.muscleGroupArray}
            updateTemplateComponent={template => this.props.updateTemplateComponent(template)}
          />
        </Card>
      )
    }
  }



  class TemplateSection extends React.Component {

    render(){
      const sections = _.omit(this.props.selectedTemplateTree, ['equipmentList']);
      const sectionItems = Object.keys(sections).map((key) => 
          <ListGroup.Item key={key}>
              <TemplateComponent 
                component={sections[key]} 
                section={key}
                selectedTemplateTree={this.props.selectedTemplateTree} 
                exercisesArray={this.props.exercisesArray}
                muscleGroupArray={this.props.muscleGroupArray}
                updateTemplateComponent={template => this.props.updateTemplateComponent(template)}
                />
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
  }

  class TemplateComponent extends React.Component {
    
    
    updateExerciseTemplate(sectionkey, compKey, item){
      var currentTemplate = this.props.selectedTemplateTree;

      currentTemplate[sectionkey][compKey] = item;
      this.props.updateTemplateComponent(currentTemplate);
    }
    
    renderSpecificExerciseDropdownList(sectionkey, compKey, compItem){
      var exercisesArray = this.props.exercisesArray;
      const exercises = _.filter(exercisesArray, function(item) {return item.muscleGroup === compItem.muscleGroup})
      const dropdownItems = exercises.map((item, i) =>
      <Dropdown.Item key={i} onClick={() => this.updateExerciseTemplate(sectionkey, compKey, item)}>
            {item.exerciseName}
          </Dropdown.Item>
        );
        return(
          <Dropdown.Menu key={compItem.muscleGroup}>
          {dropdownItems}
        </Dropdown.Menu>
        )
      }
      
      
      updateMuscleGroupTemplate(sectionKey, compKey, item){
        var currentTemplate = this.props.selectedTemplateTree;
        var newComp = {"exerciseName" : "", "muscleGroup" : item, "secondaries" : false}; //updating indiv values is scuffed, have to create whole new component

        currentTemplate[sectionKey][compKey] = newComp;
        this.props.updateTemplateComponent(currentTemplate);
      }
      
      
      renderMuscleGroupDropdownList(sectionKey, compKey, compObj){
        const mGroups = this.props.muscleGroupArray;
        const dropdownItems = mGroups.map((item, i) =>
        <Dropdown.Item key={i} onClick={() => this.updateMuscleGroupTemplate(sectionKey, compKey, item)}>
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
        const components = this.props.component;
        return(
          <Card>
            <Table striped bordered hover>
                <thead>
                  <tr key="templateTableHeaders">
                      <th>{this.props.section}</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((compItem, compKey) => {
                    return(
                      <tr key={compKey}>
                        <td>
                        <Row>
                          Muscle Group 
                          <Dropdown>
                            <Dropdown.Toggle id="muscleGroupDropdown">{compItem.muscleGroup.length > 0 ? compItem.muscleGroup : 'Random'}</Dropdown.Toggle>
                            {this.renderMuscleGroupDropdownList(this.props.section, compKey, compItem)}                        
                          </Dropdown>
                          {compItem.muscleGroup !== 'Random' && 
                            <Dropdown>
                              <Dropdown.Toggle id="specExDropdown" key="specExDropdown">{compItem.exerciseName.length > 0 ? compItem.exerciseName : 'Random'}</Dropdown.Toggle>
                              {this.renderSpecificExerciseDropdownList(this.props.section, compKey, compItem)}                        
                            </Dropdown>
                          }
                          {/* {compItem.secondaries} */}
                        </Row>
                        </td>
                      </tr>
                      )
                  })}
                </tbody>
            </Table>
          </Card>
      )
    }
  }
    
    export default Configurations