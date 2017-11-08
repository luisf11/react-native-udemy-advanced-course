//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from "react-native";

//get the width of the current phone
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

// create a component
class Deck extends Component {
  //to define default props
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  }
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    // responsable of catch all the movement that the user does
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // its called multiple time as the user move the finger on the screen
      onPanResponderMove: (event, gesture) => {
        //setting values of x and y
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      //when the user stop the gesture
      onPanResponderRelease: (event, gesture) => {
        if(gesture.dx > SWIPE_THRESHOLD){
          this.forceSwipe('right');
        }else if(gesture.dx < -SWIPE_THRESHOLD){
          this.forceSwipe('left');
        }else{

            this.resetPosition();
        }
      }
    });
    this.state = { panResponder, position , index:0 };
  }
  forceSwipe(direction){
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH ;
    Animated.timing(this.state.position, {
      //ECS 6
      toValue: { x , y: 0},
      duration: SWIPE_OUT_DURATION
      //this execute only after the animation
  }).start(()=>this.onSwipeComplete(direction));
  }
  onSwipeComplete(direction){
    const {onSwipeRight , onSwipeLeft, data} = this.props;
    const item = data[this.state.index];

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({x: 0, y: 0});
    this.setState({index: this.state.index + 1});
  }
//set the position of the card to initial state
  resetPosition(){
      Animated.spring(this.state.position, {
          toValue: {x:0 , y: 0}
      }).start();
  }
  getCardStyle(){
      // to get direct access to the position
      const {position} = this.state;
      //interpolation 
      const rotate = position.x.interpolate({
          //distance moved on x axis
        inputRange: [-SCREEN_WIDTH * 1.5,0,SCREEN_WIDTH * 1.5],
        // the rotation depending on the distance
        outputRange: ['-120deg','0deg','120deg']
      });
    return {
        ...position.getLayout(),
        //ES6  = rotate: rotate
        transform: [{ rotate }]
    };

  }

  renderCards() {
    if(this.state.index >= this.props.data.length){
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, i) => {
      if(i < this.state.index) {return null;}
        // add movement only to the top card
        if(i === this.state.index){
            return(
                // animating the view
                <Animated.View
                key={item.id}
                 style={this.getCardStyle()}
                {...this.state.panResponder.panHandlers}
                >
                    {this.props.renderCard(item)}
                </Animated.View>
            );
        }
      return this.props.renderCard(item);
    });
  }
  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  }
});

//make this component available to the app
export default Deck;
