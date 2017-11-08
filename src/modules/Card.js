//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, PanResponder } from "react-native";

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
  renderCards() {
    return this.props.data.map(item => {
      return this.props.renderCard(item);
    });
  }
  render() {
    return (
      <Animated.View
        style={this.state.position.getLayout()}
        {...this.state.panResponder.panHandlers}
      >
        {this.renderCards()}
      </Animated.View>
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
