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
        secondaryMap: new Map(),
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
          var tempArray = doc.data().muscleGroup;
          tempArray.map(group => muslceGroupsTemp.push(group));

        });

        muslceGroupsTemp.push("Random"); 
        this.setState({muscleGroupArray: _.uniq(muslceGroupsTemp)}) //set available muscle groups
        this.setState({exercisesArray : exercisesArray})
      });
    }

    getSecondaryData = () =>{
      let secondaryMap = new Map();
      this.props.firestore.collection("secondaryExercises").get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
          secondaryMap.set(doc.id, doc.data());
        });

        this.setState({secondaryMap: secondaryMap})
      });
    }
  
    componentDidMount() {
      this.getTemplateData();
      this.getExerciseData();
      this.getSecondaryData();
    }
  

    buildWorkout(){
      var workoutArray = [];
      const template = _.omit(this.state.selectedTemplateTree, ['equipmentList']);
      for(let section in template){
        for(let component in template[section])
        {
          var exercise = "";
          var secondary = "";
          //could refactor this into another function to clean it up
          var tempExercisesArray = []
          var tempSecondaryArray = []

          if(template[section][component].exerciseName !== "Random"){ //check if specific exercise is set
            exercise = template[section][component]
          } 
          else{
            tempExercisesArray = _.filter(this.state.exercisesArray, function(exercise) {return exercise.muscleGroup.includes(template[section][component].muscleGroup)})
            tempExercisesArray = this.filterUsedExercises(tempExercisesArray, workoutArray);
            exercise = tempExercisesArray[Math.floor(Math.random() * tempExercisesArray.length)]
          }


          if(template[section][component].secondaries !== "" && template[section][component].secondaries !== "None")
          {
            if(template[section][component].secondaries !== "Random"){
              secondary = this.getExerciseByName(template[section][component].secondaries);
            }
            else{
              tempSecondaryArray = this.getSecondaryListByName(exercise.exerciseName);
              tempSecondaryArray = _.filter(this.state.exercisesArray, function(exercise) {return tempSecondaryArray.includes(exercise.exerciseName)});
              tempSecondaryArray = this.filterUsedExercises(tempSecondaryArray, workoutArray);
              secondary = tempSecondaryArray[Math.floor(Math.random() * tempSecondaryArray.length)];
            }
          }
          workoutArray.push({"exerciseName" : exercise.exerciseName, "secondaryName" : this.checkDefined(secondary)});
        }
      }
      this.setState({builtWorkout: workoutArray});
    }

    checkDefined(exercise){
      if(exercise !== undefined)
        return exercise.exerciseName;
      else
        return "";
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

    getSecondaryListByName(exerciseName){
      return this.state.secondaryMap.get(exerciseName).secondaryList;
    }

    getExerciseByName(exerciseName){
      return _.find(this.state.exercisesArray, {'exerciseName' : exerciseName})
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
            secondaryMap={this.state.secondaryMap}
            />
          {this.state.builtWorkout !== undefined && <Workout builtWorkout={this.state.builtWorkout}/>}  
        </div>
    );
  }
  }

  export default Main