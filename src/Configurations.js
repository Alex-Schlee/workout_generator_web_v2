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

  
    render(){
      return(
        <Card>
          <TemplateSection 
            selectedTemplateTree={this.props.selectedTemplateTree}
            exercisesArray={this.props.exercisesArray}
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
    
    
    
    updateMuscleGroupTemplate(key, i, item){
      // this.props.selectedTemplateTree[key][i]["muscleGroup"] = item;
    }
    
    
    renderSpecificExerciseDropdownList(key, muscleGroup){
      const exercisesArray = this.props.exercisesArray;
      console.log(exercisesArray);
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
      
      renderMuscleGroupDropdownList(section){
        const mGroups = MUSCLE_GROUPS;
        const dropdownItems = mGroups.map((item, i) =>
        <Dropdown.Item key={i} onClick={() => this.updateMuscleGroupTemplate(section, i, item)}>
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
        const exercisesArray = this.props.exercisesArray;
        const currentTemplate = this.props.selectedTemplateTree;
        return(
          <Card>
            <Table striped bordered hover>
                <thead>
                  <tr key="templateTableHeaders">
                      <th>{this.props.section}</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((item, i) => {
                    return(
                      <tr key={i}>
                        <td>
                        <Dropdown>
                          <Dropdown.Toggle id="muscleGroupDropdown">{item.muscleGroup.length > 0 ? item.muscleGroup : 'Random'}</Dropdown.Toggle>
                          {this.renderMuscleGroupDropdownList(this.props.section)}                        
                        </Dropdown>
                        {item.muscleGroup !== 'Random' &&
                          <Dropdown>
                            <Dropdown.Toggle id="specExDropdown" key="specExDropdown">{item.exerciseName.length > 0 ? item.exerciseName : 'Random'}</Dropdown.Toggle>
                            {this.renderSpecificExerciseDropdownList(this.props.section, item.muscleGroup)}                        
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
  }
    
    export default Configurations