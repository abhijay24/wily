import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config';

export default class SearchScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      allTransactions: [],
      search:' '
    }
  }

  componentDidMount=async()=>{
    const query = await db.collection('transactions').get()
    query.docs.map(doc =>{
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()]
      })
    })
  }
 render(){
  return(
    <View style = {styles.container}>
      <View style = {styles.SearchBar}>
        <TextInput style = {styles.inputBox}
        placeholder = 'bookId'
        onChangeText = {(text)=>{
          this.setState({
            search:text
            
          })
        }}
        />
        
  <TouchableOpacity style = {styles.button} onPress = {()=>{
    this.searchTransactions(this.state.search)
  }}>
        <Text>search
        </Text>
  </TouchableOpacity>
      </View>
    <FlatList 
    data = {this.state.allTransactions}
    renderItem = {({item})=>(
      <View styles = {{borderBottomWidth: 2}}>
        <Text>{item.bookId}</Text>
        <Text>{item.studentId}</Text>
        <Text>{item.transactionType}</Text>
        <Text>{item.date.toDate()}</Text>
      </View>
    )}
    keyExtractor = {(item, index)=>index.toString()}
    onEndReached = {this.fetchMoreTransactions}
    onEndReachedThreshold = {0.7}
    />
    
        <Text>
            search
        </Text>
    </View>
  )

 }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
