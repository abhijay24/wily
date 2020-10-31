import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Alert} from 'react-native';
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-permissions'
import firebase from 'firebase';
import db from '../config'

export default class BookTransaction extends React.Component{
 constructor(){
   super()
   this.state = {
     hasCameraPermissions: null,
     scanned: false,
     scannedBookId:' ',
     scannedStudentId: ' ',
     buttonState: 'normal'
   }
 }
 getCameraPermissions = async(id)=>{
  const {status} = await Permissions.askAsync(Permissions.CAMERA)
  this.setState({
   hasCameraPermissions : status==='granted',
   buttonState: id,
   scanned: false
  })
 }
 handleBarCodeScanned = async({type,data})=>{
   const {buttonState}= this.state
   if(buttonState === 'BookId'){
     this.setState({
     scanned: true,
     scannedBookId: data, 
     buttonState:'normal'
     })
   }
   else if(buttonState === 'studentId'){
    this.setState({      
     scanned: true,
     scannedStudentId: data, 
     buttonState:'normal'
    })
   }
 }
 handleTransaction = async()=>{
  var transactionType = await this.checkBookEligibility()
  if(! transactionType){
   Alert.alert('the book does not exist in the library database') 
   this.setState({
     scannedStudentId: ' ',
      scannedBookId:' '
   })
  }
  else if(transactionType === 'issue'){
    var isStudentEligible = await this.checkStudentEligibilityForBookIssue()
    if(isStudentEligible ){
      this.initiateBookIssue()
      Alert.alert('the book has been issued to the student')
    }
  }
  else{
    var isStudentEligible = await this.checkStudentEligibilityForBookReturn()
    if(isStudentEligible){
      this.initiateBookReturn()
      Alert.alert('the book has been returned successfully')
    }
  }
 }
 initiateBookIssue = async()=>{
   db.collections('transactions').add ({
     'studentId': this.state.scannedStudentId,
     'bookId': this.state.scannedBookId,
     'date': firebase.firestore.TimeStamp.now().toDate(),
     'transactionType': 'issue' 
   })
   db.collection('books').doc(this.state.scannedBookId).update({
     'bookAvailability': false
   })
   db.collections('students').doc(this.state.scannedStudentId).update({
     'numberOfBooksIssued': firebase.firestore.fieldValue.increment(1)
   })
 }
 initiateBookReturn = async()=>{
  db.collections('transactions').add ({
    'studentId': this.state.scannedStudentId,
    'bookId': this.state.scannedBookId,
    'date': firebase.firestore.TimeStamp.now().toDate(),
    'transactionType': 'return' 
  })
  db.collection('books').doc(this.state.scannedBookId).update({
    'bookAvailability': true
  })
  db.collections('students').doc(this.state.scannedStudentId).update({
    'numberOfBooksIssued': firebase.firestore.fieldValue.increment(-1)
  })
}

  checkStudentEligibilityForBookIssue = async()=>{
    const studentRef = await db.collection('students').where('studentId','==', this.state.scannedStudentId).get()
    var isStudentEligible = ' '
    if(studentRef.docs.length == 0){
      this.setState({
        scannedStudentId: ' ',
        scannedBookId: ' '
      })
      isStudentEligible === false
      Alert.alert(' the student id does not exist')
    }
    else{
      studentRef.docs.map(doc=>{
        var student = doc.data()
        if(student.numberOfBooksIssued < 2){
          isStudentEligible = true
        }
        else {
          isStudentEligible = false
        Alert.alert('the student has already issued 2 books')
        this.setState({
          scannedStudentId: ' ',
          scannedBookId: ' '
        })
      }
      })
    return isStudentEligible
    }
  }
  checkStudentEligibilityForBookReturn = async()=>{
    const transactionRef = await db.collection('transactions').where('bookId','==',this.state.scannedBookId).limit(1).get
    var isStudentEligible = ' '
    transactionRef.docs.map(doc=>{
      var lastBookTransaction = doc.data()
      if(lastBookTransaction.studentId === this.state.scannedStudentId){
        isStudentEligible = true
      }
      else{
        isStudentEligible = false
        Alert.alert('the book was not issued by the student')
        this.setState({
          scannedStudentId:' ',
          scannedBookId:' '
        })
      
      }
    })
  return(isStudentEligible)
  }
  //need to e=write checkBookEligibility
  render(){
    const hasCameraPermissions = this.state.hasCameraPermissions
    const scanned = this.state.scanned
    const buttonState = this.state.buttonState
    if(buttonState !== 'normal' && hasCameraPermissions){
      return(
        <BarCodeScanner
        onBarCodeScanned = {scanned? undefined : this.handleBarCodeScanned}
        style = {StyleSheet.absoluteFillObject}
        />
      )
    }
   else if(buttonState === 'normal'){

   
  return(
    <KeyboardAvoidingView style = {styles.container} behavior = 'padding' enabled>
      <View>
        <Image
        source = {require('../assets/booklogo.jpg')}
        style = {{width: 200, height: 200}}
        />
        <Text style = {{textAlign: 'center', fontSize:20}}>
        WILY
        </Text>
      </View>
      <View style = {styles.inputView}>
        <TextInput
         style = {styles.inputBox}
         placeholder = {'BookId'}
         onChangeText = {(text)=>{
           this.setState({
             scannedBookId: text
           })
         }}
         value = {this.state.scannedBookId}
        />
        <TouchableOpacity style = {styles.scanButton}
        onPress = {()=>{
          this.getCameraPermissions('BookId')
        }}
        >
          <Text style = {styles.buttonText}>
            Scan
          </Text>

        </TouchableOpacity>
        <View style = {styles.inputView}>
        <TextInput
        style = {styles.inputBox}
        placeholder = {'studentId'}
        onChangeText = {(name)=>{
          this.setState({
            scannedStudentId:'name'
          })
        }}
        value = {this.state.scannedStudentId}
        />
        <TouchableOpacity style = {styles.scanButton}
        onPress = {()=>{
          this.getCameraPermissions('studentId')
        }}
        >
        <Text style = {styles.buttonText}>
        Scan
        </Text>
        </TouchableOpacity>
        </View>
      </View>
        <Text>
        {hasCameraPermissions === true ? this.state.scannedData:'request camera permissions'}
        </Text>
        <TouchableOpacity style = {styles.scanButton} onPress = {this.getCameraPermissions}>
          <Text style = {styles.buttonText}>
            Scan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.submitButton} onPress = {()=>{
          this.handleTransaction()
          this.setState({
            scannedBookId:' ',
            scannedStudentId: ' '
          })
        }}>
          <Text style = {styles.submitButtonText}>
            Submit
          </Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
  )

 }

}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton :{
    backgroundColor : 'grey',
    padding : 10,
    margin: 10
  },
  buttonText:{
    fontSize: 15,
    fontWeight: 'bold'
  },
  inputView:{
    flexDirection: 'row',
    margin:20,
  },
  inputBox:{
    width:200,
    height:40,
    borderWidth: 2,
    fontSize:20
  },
  submitButton:{
    backgroundColor:'grey',
    width: 100,
    height:50
  },
  submitButtonText:{
    padding:10,
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
    color:'black'
  }
});

//some modification in handle barcode scan c70 little left