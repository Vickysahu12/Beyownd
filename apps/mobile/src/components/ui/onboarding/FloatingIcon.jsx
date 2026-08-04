import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FloatingIcon({
  source,
  title,
  subtitle,
  style,
  delay = 0,
}) {

  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(y,{
          toValue:-8,
          duration:1800,
          delay,
          useNativeDriver:true,
        }),
        Animated.timing(y,{
          toValue:0,
          duration:1800,
          useNativeDriver:true,
        }),
      ])
    ).start();
  },[]);

  return (

    <Animated.View
      style={[
        styles.card,
        style,
        {
          transform:[{translateY:y}]
        }
      ]}
    >

      <Image
        source={source}
        style={styles.icon}
      />

      <View style={{marginLeft:10}}>

        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>

      </View>

    </Animated.View>

  );
}

const styles=StyleSheet.create({

  card:{
    position:"absolute",

    flexDirection:"row",
    alignItems:"center",

    paddingHorizontal:14,
    paddingVertical:12,

    borderRadius:22,

    backgroundColor:"rgba(255,255,255,.94)",

    shadowColor:"#000",
    shadowOpacity:.08,
    shadowRadius:20,
    shadowOffset:{
      width:0,
      height:8,
    },

    elevation:8,
  },

  icon:{
    width:42,
    height:42,
  },

  title:{
    fontSize:15,
    fontWeight:"700",
    color:"#1D1713",
  },

  subtitle:{
    marginTop:2,
    fontSize:12,
    color:"#7C726C",
  }

});