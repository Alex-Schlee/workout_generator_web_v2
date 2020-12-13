import React from 'react';
import './App.css';

import Configurations from './Configurations';


class Main extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        exercises: [], //what type of exercise, paired, single, etc
        templateIds: [],
        templatesMap: new Map(),
        selectedTemplateId: "Body Weight",
        selectedTemplateTree: []
      }
    }
  
    handleTemplateSelectionClick(template){
      this.setState({selectedTemplateId: template});
      this.setState({selectedTemplateTree: this.state.templatesMap.get(template)})
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
            selectedTemplateTree={this.state.selectedTemplateTree}
            updateSelectedTemplate={template => this.handleTemplateSelectionClick(template)}
            onBuildWorkoutClick={ () => this.buildWorkout()}
            firestore={this.props.firestore}
            />
        </div>
    );
  }
  }

  export default Main