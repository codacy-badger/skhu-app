import React, {Component} from 'react';
import ListItem from '../components/listitem';
import {ScrollView, View, Text, ActivityIndicator} from 'react-native';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import moment from 'moment';
import {ThemedText} from '../components/components';


export default class Schedules extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <ScrollView style={{height: '100%'}}>
        <ScheduleComponent year={moment().year()} month={moment().month()+1}/>
        <ScheduleComponent year={moment().add(1, 'months').year()} month={moment().add(1, 'months').month()+1}/>
        <ScheduleComponent year={moment().add(2, 'months').year()} month={moment().add(2, 'months').month()+1}/>
      </ScrollView>
    );
  }
}

class ScheduleComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      dates: '',
      contents: '',
      isLoading: false
    };
  }
  async componentDidMount(){
    this.setState({isLoading: true});
    let schedule = await ForestApi.post('/life/schedules', JSON.stringify({
      'year': this.props.year,
      'month': this.props.month
    }), false);
    if(schedule.ok){
      let data = await schedule.json();
      let dates = '', contents = '';
      for(let item of data.schedules){
        dates += `${item.period}\n`;
        contents += ` | ${item.content}\n`;
      }
      this.setState({
        dates: dates,
        contents: contents,
        isLoading: false
      });
    }
  }
  render(){
    let content;
    if(this.state.isLoading){
      content = (
        <View style={{justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
        </View>
      );
    }else{
      content = (
        <View style={{flexDirection: 'row'}}>
          <ThemedText style={{flex: 0, fontWeight: 'bold'}}>{this.state.dates}</ThemedText>
          <ThemedText style={{flex: 1}}>{this.state.contents}</ThemedText>
        </View>
      );
    }
    return(
      <View>
        <ListItem isHeader={true}>
          <ThemedText>{this.props.year}{'.'}{this.props.month}</ThemedText>
        </ListItem>
        <ListItem>
          {content}
        </ListItem>
      </View>
    );
  }
}