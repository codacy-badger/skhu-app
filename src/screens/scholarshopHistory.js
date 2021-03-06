import React, {Component} from 'react';
import ListItem from '../components/listitem';
import {View, FlatList, ActivityIndicator} from 'react-native';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {ThemedText} from '../components/components';


export default class ScholarshipHistory extends Component{

  constructor(props){
    super(props);
    this.state = {
      history: [],
      isLoading: false
    };
  }
  async componentDidMount(){
    this.setState({isLoading: true});
    const scholarship_history = await ForestApi.get('/scholarship/history', true);
    if(scholarship_history.ok){
      const data = await scholarship_history.json();
      this.setState({
        history: data.scholarship_history,
        isLoading: false
      });
    }
  }
  render(){
    if(this.state.isLoading){
      return(
        <View style={{justifyContent: 'center', padding: 32}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      return(
        <FlatList
          data={this.state.history}
          renderItem={({item})=>(
            <ListItem>
              <ThemedText>{item.year}년 {item.semester}</ThemedText>
              <ThemedText style={{fontWeight: 'bold'}}>{item.scholarship_name}</ThemedText>
              <ThemedText>입학장학 {item.amount_entrance}원, 수업장학 {item.amount_class}원 {item.benefit_type}</ThemedText>
              <ThemedText>{item.note}</ThemedText>
            </ListItem>
          )}
        />
      );
    }
  }
}

