import React, {Component} from 'react';
import {CardItem} from '../components/components';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';


export default class Schedules extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;
          
      return {
        title: '학사 일정',
      };
    };
    constructor(props){
      super(props);
    }
    render(){
      const today = new Date();
      return(
        <ScrollView>
          <ScheduleComponent year={today.getFullYear()} month={today.getMonth()+1}/>
          <ScheduleComponent year={today.getFullYear()} month={today.getMonth()+2}/>
          <ScheduleComponent year={today.getFullYear()} month={today.getMonth()+3}/>
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
    console.log(schedule);
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
          <Text style={{flex: 0, fontWeight: 'bold'}}>{this.state.dates}</Text>
          <Text style={{flex: 1}}>{this.state.contents}</Text>
        </View>
      );
    }
    return(
      <View>
        <CardItem isHeader={true}>
          <Text>{this.props.year}{'.'}{this.props.month}</Text>
        </CardItem>
        <CardItem>
          {content}
        </CardItem>
      </View>
    );
  }
}