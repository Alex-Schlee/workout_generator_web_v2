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
      <Card.Text>
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
      </Card.Text>
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
        const sections = selectedTemplateTree;
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
                        <ListGroup>
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
        const componentItems = components.map((item, i) =>
        <Card>
            Exercise: {i+1}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Area Focus</th>
                        <th>Muscle Group</th>
                        <th>Specific Exercise</th>
                        <th>Secondaries</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                        <Dropdown>
                            <Dropdown.Toggle id="focusListDropdown">{item.focus}</Dropdown.Toggle>

                        </Dropdown>
                        </td>
                        <td>{item.muscleGroup}</td>
                        <td>{item.exerciseName}</td>
                        <td>{item.secondaries.toString()}</td>
                    </tr>
                </tbody>
            </Table>
        </Card>
        );
        return(
            <div>
                {componentItems}
            </div>
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