//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from "react-native";

//get the width of the current phone
const SCREEN_WIDTH = Dimensions.get('window').width;

// create a component
class Deck extends Component {
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
      onPanResponderRelease: () => {}
    });
    this.state = { panResponder, position };
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
    return this.props.data.map((item, index) => {
        // add movement only to the top card
        if(index === 0){
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
