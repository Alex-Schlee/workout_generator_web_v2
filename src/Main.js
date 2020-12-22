import React from 'react';
import './App.css';

import Configurations from './Configurations';


class Main extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        exercisesArray: [], //what type of exercise, paired, single, etc
        templatesMap: new Map(),
        templateIds: [],
        selectedTemplateId: "Body Weight",
        selectedTemplateTree: []
      }
    }
  
    handleTemplateSelectionClick(template){
      this.setState({selectedTemplateId: template});
      this.setState({selectedTemplateTree: this.state.templatesMap.get(template)})
    }

    handleTemplateUpdateClick(template){
      this.setState({selectedTemplateTree: template})
    }
  
    getTemplateData = () => {
      var templateIds = [];
      let templateMap = new Map();
      this.props.firestore.collection("templates").get().then((querySnapshot) => { //arrow function bings 'this' automatically
        querySnapshot.forEach(function(doc) {
          templateIds.push(doc.id);
          templateMap.set(doc.id, doc.data());
        });
  
        this.setState({templatesMap : templateMap});
        this.setState({templateIds : templateIds});
  
        if(this.state.templateIds.indexOf(this.state.selectedTemplateId === -1))//if the selected template does not exist replace with first value
          this.setState({selectedTemplateId : templateIds[0]});
          this.setState({selectedTemplateTree: this.state.templatesMap.get(templateIds[0])})
      });
    }

    getExerciseData = () => {
      let exercisesArray = [];
      this.props.firestore.collection("exercises").get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
          exercisesArray.push(doc.data());
        });

        this.setState({exercisesArray : exercisesArray})
      });
    }
  
    componentDidMount() {
      this.getTemplateData();
      this.getExerciseData();
    }
  
  
  
    render(){
      return ( 
        <div className="Main">
          <Configurations 
            selectedTemplateId={this.state.selectedTemplateId} 
            templateIds={this.state.templateIds} 
            selectedTemplateTree={this.state.selectedTemplateTree}

            updateSelectedTemplate={template => this.handleTemplateSelectionClick(template)}
            updateTemplateComponent={template => this.handleTemplateUpdateClick(template)}
            onBuildWorkoutClick={ () => this.buildWorkout()}

            exercisesArray={this.state.exercisesArray}
            />
        </div>
    );
  }
  }

  export default Main