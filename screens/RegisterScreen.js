import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect , useState } from 'react'
import {Button, Input } from "react-native-elements";
import {StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from 'react-native';
//import { auth } from '../firebase';

const RegisterScreen = ({navigation}) => {

  const [name, setName] = useState("")
  const [num, setNumber] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPassword] = useState("")

  // useLayoutEffect (() => {
  //   navigation.setOption({
  //     headerBackTitle: "Press to go back!"
  //   });
  // }, [navigation]);



  //  const register = ()=> {
   
  //  };

  return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <StatusBar style="light"/>
          <Text>RegisterScreen</Text>
          <View style= {styles.inputContainer}>

              <Input placeholder="Name" autoFocus type="name"
              value={name} onChangeText={(text) => setName(text)}/>

              <Input placeholder="Number" autoFocus type="num"
              value={num} onChangeText={(int) => setNumber(int)}/>

              <Input placeholder="Email" autoFocus type="email"
              value={email} onChangeText={(text) => setEmail(text)}/>

              <Input placeholder="Password" secureTextEntry type="password"
              value={pass} onChangeText={(text) => setPassword(text)}/>

          </View>

          <Button onPress={() => navigation.navigate("Main")} 
           containerStyle={styles.button} title="Login"/>

          <Button onPress={() => navigation.navigate("Main")} 
           containerStyle={styles.button} title="Regstier"/>
          
          {/* <Button containerStyle={styles.button} raised onPress={Regstier} title="Regstier"/> */}


          
       </KeyboardAvoidingView>
  );
};

export default RegisterScreen 

const styles = StyleSheet.create({
  Container:{
      flex: 1,
      alignItems: "center",
      justifyContent:"center",
      padding: 10,
  },
  inputContainer:{},
  button:{},

});
