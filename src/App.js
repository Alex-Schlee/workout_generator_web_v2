import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './config';
import Main from './Main';

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
            <h1>Rando WOG V2</h1>
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

        <Col xs={9}>
          <Card>
            <section>
              {user ? <Main firestore={firestore} /> : <SignIn />}
            </section> 
          </Card>
        </Col>

        <Col></Col>
      </Row>

    </Container>
  </div>
  );
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
