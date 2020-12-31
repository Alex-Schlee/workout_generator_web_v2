import React from 'react';
import './App.css';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
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
            secondaryMap={this.props.secondaryMap}
            />
            </Col>
        </Row>
      </Card>
      )
    }
  }
  
  class Template extends React.Component {

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
                secondaryMap={this.props.secondaryMap}
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
      var newComp = {"exerciseName" : item, "muscleGroup" : currentTemplate[sectionkey][compKey].muscleGroup, "secondaries" : "None"}; //updating indiv values is scuffed, have to create whole new component

      currentTemplate[sectionkey][compKey] = newComp;
      this.props.updateTemplateComponent(currentTemplate);
    }
    
    renderSpecificExerciseDropdownList(sectionKey, compKey, compItem){
      var exercisesArray = this.props.exercisesArray;
      const exercises = _.filter(exercisesArray, function(item) {return item.muscleGroup.includes(compItem.muscleGroup)})
      const dropdownItems = exercises.map((item, i) =>
      <Dropdown.Item key={i} onClick={() => this.updateExerciseTemplate(sectionKey, compKey, item.exerciseName)}>
            {item.exerciseName}
          </Dropdown.Item>
        );
        return(
          <Dropdown.Menu key={compItem.muscleGroup}>
            <Dropdown.Item key="random" onClick={() => this.updateExerciseTemplate(sectionKey, compKey, "Random")}>
              Random    
            </Dropdown.Item>
            {dropdownItems}
          </Dropdown.Menu>
        )
      }
      
      
      updateMuscleGroupTemplate(sectionKey, compKey, item){
        var currentTemplate = this.props.selectedTemplateTree;
        var newComp = {"exerciseName" : "Random", "muscleGroup" : item, "secondaries" : "None"}; //updating indiv values is scuffed, have to create whole new component

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

        updateSecondaryTemplate(sectionKey, compKey, item){
          var currentTemplate = this.props.selectedTemplateTree;
          var newComp = {"exerciseName" : currentTemplate[sectionKey][compKey].exerciseName, "muscleGroup" : currentTemplate[sectionKey][compKey].muscleGroup, "secondaries" : item}; //updating indiv values is scuffed, have to create whole new component
  
          currentTemplate[sectionKey][compKey] = newComp;
          this.props.updateTemplateComponent(currentTemplate);
      }


      renderSecondaryDropdownList(sectionKey, compKey, compObj){
        const mGroups = this.props.secondaryMap.get(compObj.exerciseName).secondaryList;
        const dropdownItems = mGroups.map((item, i) =>
        <Dropdown.Item key={i} onClick={() => this.updateSecondaryTemplate(sectionKey, compKey, item)}>
              {item}
            </Dropdown.Item>
          );
          return(
            <Dropdown.Menu>
            <Dropdown.Item key="none" onClick={() => this.updateSecondaryTemplate(sectionKey, compKey, "None")}>None</Dropdown.Item>
            <Dropdown.Item key="random" onClick={() => this.updateSecondaryTemplate(sectionKey, compKey, "Random")}>Random</Dropdown.Item>
            {dropdownItems}
          </Dropdown.Menu>
          )
        }
      
      getSecondaryListByName(exerciseName){
        if(this.props.secondaryMap.has(exerciseName))
          return this.props.secondaryMap.get(exerciseName).secondaryList;
        else
          return null;
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
                          <Form>
                          <Form.Row>
                            <Form.Group>
                              <Form.Label>Muscle Group</Form.Label>
                              <Dropdown>
                                <Dropdown.Toggle id="muscleGroupDropdown">{compItem.muscleGroup.length > 0 ? compItem.muscleGroup : 'Random'}</Dropdown.Toggle>
                                {this.renderMuscleGroupDropdownList(this.props.section, compKey, compItem)}                        
                              </Dropdown>
                            </Form.Group>

                            {compItem.muscleGroup !== 'Random' && 
                            <Form.Group>
                              <Form.Label>Exercise</Form.Label>
                              <Dropdown>
                                <Dropdown.Toggle id="specExDropdown" key="specExDropdown">{compItem.exerciseName.length > 0 ? compItem.exerciseName : 'Random'}</Dropdown.Toggle>
                                {this.renderSpecificExerciseDropdownList(this.props.section, compKey, compItem)}                        
                              </Dropdown>
                            </Form.Group>
                            }
                            {compItem.exerciseName !== 'Random' && compItem.exerciseName.length > 0 && this.getSecondaryListByName(compItem.exerciseName) !== null && 
                            <Form.Group>
                            <Form.Label>Secondary</Form.Label>
                              <Dropdown>
                                <Dropdown.Toggle id="secondaryDropdown" key="secondaryDropdown">{compItem.secondaries.length > 0 ? compItem.secondaries : 'Random'}</Dropdown.Toggle>
                                {this.renderSecondaryDropdownList(this.props.section, compKey, compItem)}                        
                              </Dropdown>
                            </Form.Group>
                            }
                          </Form.Row>
                          </Form>
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