import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './config';

import 'bootstrap/dist/css/bootstrap.min.css';

import {useAuthState} from 'react-firebase-hooks/auth';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

firebase.initializeApp(config);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
  <div className="App">
    <header>
      <Container>
        <Row>
          <Col></Col>

          <Col xs={6}>
            <h1>Rando WOG V1</h1>
          </Col>

          <Col>
            <SignOut />
          </Col>
        </Row>
      </Container>
    </header>

    <Container>
      <Row>
        <Col></Col>

        <Col xs={6}>
          <Card>
            <Card.Body>
              <section>
                {user ? <Main /> : <SignIn />}
              </section> 
            </Card.Body>
          </Card>
        </Col>

        <Col></Col>
      </Row>

    </Container>
  </div>
  );
}


class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      exercises: [], //what type of exercise, paired, single, etc
      templateIds: [],
      templatesMap: new Map(),
      selectedTemplateId: "Body Weight",
      templateMain : [],
      builtMain: []
    }
  }

  handleTemplateSelectionClick(template){
    this.setState({selectedTemplateId: template});
  }

  getTemplateData = () => {
    var templateIds = [];
    let templateMap = new Map();
    firestore.collection("templates").get().then((querySnapshot) => { //arrow function bings 'this' automatically
      querySnapshot.forEach(function(doc) {
        templateIds.push(doc.id);
        templateMap.set(doc.id, doc.data());
      });

      this.setState({templatesMap : templateMap});
      this.setState({templateIds : templateIds});

      if(this.state.templateIds.indexOf(this.state.selectedTemplateId === -1))//if the selected template does not exist replace with first value
        this.setState({selectedTemplateId : templateIds[0]});
    });
  }

  componentDidMount() {
    this.getTemplateData();
  }



  render(){
    return ( 
      <div className="Main">
        <Configurations 
          selectedTemplateId={this.state.selectedTemplateId} 
          templateIds={this.state.templateIds} 
          selectedTemplateTree={this.state.templatesMap.get(this.state.selectedTemplateId)}
          updateSelectedTemplate={template => this.handleTemplateSelectionClick(template)}
          onBuildWorkoutClick={ () => this.buildWorkout()}
          />
      </div>
  );
}
}

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
        <Template selectedTemplate={this.props.selectedTemplateTree} />
      </Row>
    </Card.Text>
    )
  }
}

class Template extends React.Component {
  renderTemplateComponents(selectedTemplateTree){

  }

  render(){
    return(
      <Card>
        {this.renderTemplateComponents(this.props.selectedTemplateTree)}
      </Card>
    )
  }
}


/* authentication begins */
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider);
  }
  return(
    <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    )
}  

function SignOut() {
    return auth.currentUser && (
      <Button onClick={() => auth.signOut()}>Sign Out</Button>
      )
}
/* authentication ends */

export default App;
