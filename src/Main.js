import React from 'react';
import './App.css';

import Configurations from './Configurations';
import Workout from './Workout';

const _ = require('lodash');

class Main extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        exercisesArray: [],
        muscleGroupArray: [],
        templatesMap: new Map(),
        templateIds: [],
        selectedTemplateId: "Body Weight",
        selectedTemplateTree: [],
        builtWorkout: []
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
      this.props.firestore.collection("templates").get().then((querySnapshot) => { //arrow function binds 'this' automatically
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
      var muslceGroupsTemp = [];
      this.props.firestore.collection("exercises").get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
          exercisesArray.push(doc.data());
          muslceGroupsTemp.push(doc.data().muscleGroup)
        });
        this.setState({muscleGroupArray: _.uniq(muslceGroupsTemp)})
        this.setState({exercisesArray : exercisesArray})
      });
    }

    getExerciseDataByName = () => {
      //TODO : make calls to database to match on exercise name, should be called in secondary situations
    }
  
    componentDidMount() {
      this.getTemplateData();
      this.getExerciseData();
    }
  

    buildWorkout(){
      var workoutArray = [];
      var exercise;
      const template = _.omit(this.state.selectedTemplateTree, ['equipmentList']);
      for(let section in template){
        for(let component in template[section])
        {
          //could refactor this into another function to clean it up
          var tempExercisesArray = []

          if(template[section][component].muscleGroup !== 'Random') //random isnt a muscle group so need special case
            tempExercisesArray = _.filter(this.state.exercisesArray, {'muscleGroup' : template[section][component].muscleGroup})
          else
            tempExercisesArray = this.state.exercisesArray;

          tempExercisesArray = this.filterUsedExercises(tempExercisesArray, workoutArray);

          if(template[section][component].exerciseName !== "") //check if specific exercise is 
            exercise = template[section][component]
          else
            exercise = tempExercisesArray[Math.floor(Math.random() * tempExercisesArray.length)]

          workoutArray.push(exercise);
        }
      }
      this.setState({builtWorkout: workoutArray});
    }

    filterUsedExercises(tempExercisesArray, workoutArray){
      var filteredExercises = [];
      for(var unusedEx in tempExercisesArray){
        var dupe = false;
        //As much as I hate nested loops this must stay, unless I can find a method to search objects with properties equaling specific values
        for(var usedEx in workoutArray)
        {  
          if(workoutArray[usedEx] !== undefined && workoutArray[usedEx].exerciseName.indexOf(tempExercisesArray[unusedEx].exerciseName) !== -1)
          dupe = true;
        }
        
        if(dupe === false)
          filteredExercises.push(tempExercisesArray[unusedEx]);
      }
      return filteredExercises
    }



  
  
    render(){
      return ( 
        <div className="Main">
          <Configurations 
            muscleGroupArray={this.state.muscleGroupArray}
            selectedTemplateId={this.state.selectedTemplateId} 
            templateIds={this.state.templateIds} 
            selectedTemplateTree={this.state.selectedTemplateTree}

            updateSelectedTemplate={template => this.handleTemplateSelectionClick(template)}
            updateTemplateComponent={template => this.handleTemplateUpdateClick(template)}
            onBuildWorkoutClick={ () => this.buildWorkout()}

            exercisesArray={this.state.exercisesArray}
            />
          {this.state.builtWorkout !== undefined && <Workout builtWorkout={this.state.builtWorkout}/>}  
        </div>
    );
  }
  }

  export default Main