import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import * as React from "react";
import {View, Text, StyleSheet, KeyboardAvoidingView, Alert} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

export default class LoginScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            emailId:' ',
            password:' '
        }
    }

    login = async(emailId, password)=>{
        if(emailId && password){
            try{
                const response = await firebase.auth().signInWithEmailAndPassword(emailId, password)
                if(response){
                   this.props.navigation.navigate("Transaction") 
                }
            }
        catch(error){
             switch(error.code){
                case"user not found":
                Alert.alert("user does not exist")
                break;
                case "invalid email":
                    Alert.alert("incorrect email or password")

            }
        }
        }
        else{
            Alert.alert("enter email and password")
        }
    }
 render(){
    return(
        <KeyboardAvoidingView>
            <View>
                <Image
                source = {require("../assets/booklogo.jpg")}
                style = {{width : 200, height: 200}}
                />
                <Text>WILY</Text>
            </View>
            <View>
                <TextInput
                style = {styles.inputBox}
                placeholder = "EmailId"
                keyboardType = "email-address"
                onChangeText = {(text)=>{
                this.setState(
                    {
                        emailId: text
                    }
                )
                }}
                />
                  <TextInput
                style = {styles.inputBox}
                placeholder = "PassWord"
                secureTextEntry = {true}
                onChangeText = {(text)=>{
                this.setState(
                    {
                        password: text
                    }
                )
                }}
                />
                
            </View>
            <View>
                <TouchableOpacity styles = {styles.button}
                onpresss = {()=>{
                    this.login(this.state.emailId, this.state.password)
                }}
                >
                    <Text>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )

 }

}

//this.props.navigation.navigate("name spaced")