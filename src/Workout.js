import React from 'react';
import './App.css';

import ListGroup from 'react-bootstrap/ListGroup';

class Workout extends React.Component {

    renderWorkoutExerciseList(list){
        const workoutList = list;
        const workoutExerciseListItem = workoutList.map((item, i) =>
          <ListGroup.Item key={i}>
            {item  ? item.exerciseName : ''}
          </ListGroup.Item>
        );
        return(
        <ListGroup>
          {workoutExerciseListItem}
        </ListGroup>
        )
      }


    render(){
        return(
            <div>
                {this.renderWorkoutExerciseList(this.props.builtWorkout)}
            </div>
        )
    }
}

export default Workout