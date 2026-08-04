import React from "react";
import { Image, StyleSheet, View } from "react-native";
import FloatingIcon from "./FloatingIcon";
import FeatureCard from "./FeatureCard";

export default function HeroIllustration() {
  return (
    <View style={styles.container}>

      <View style={styles.bigGlow}/>
      <View style={styles.smallGlow}/>

      <Image
        source={require("@/assets/image/onboardingg.png")}
        style={styles.hero}
        resizeMode="contain"
      />

      <FeatureCard
        icon={require("@/assets/image/icon1.png")}
        title="Build"
        subtitle="Projects"
        style={styles.card1}
      />

      <FeatureCard
        icon={require("@/assets/image/icon2.png")}
        title="Earn"
        subtitle="Certificates"
        style={styles.card2}
      />

      <FeatureCard
        icon={require("@/assets/image/icon3.png")}
        title="Mentor"
        subtitle="Feedback"
        style={styles.card3}
      />

      <FeatureCard
        icon={require("@/assets/image/icon4.png")}
        title="Internship"
        subtitle="Ready"
        style={styles.card4}
      />

      <FloatingIcon
        source={require("@/assets/image/icon5.png")}
        style={styles.flag}
        delay={1000}
      />

    </View>
  );
}

const styles = StyleSheet.create({

container:{
height:370,
justifyContent:'center',
alignItems:'center',
marginTop:50
},

hero:{
width:370,
height:370,
zIndex:3
},

bigGlow:{
position:'absolute',
width:300,
height:300,
borderRadius:999,
backgroundColor:'#FFE8D6',
},

smallGlow:{
position:'absolute',
top:30,
right:10,
width:120,
height:120,
borderRadius:999,
backgroundColor:'#FFF3EA'
},

card1:{
position:'absolute',
left:5,
top:70
},

card2:{
position:'absolute',
right:0,
top:80
},

card3:{
position:'absolute',
left:0,
bottom:70
},

card4:{
position:'absolute',
right:5,
bottom:70
},

flag:{
position:'absolute',
bottom:10
}

})