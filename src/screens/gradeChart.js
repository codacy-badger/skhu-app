import React, {useEffect, useState} from 'react';
import ListItem from '../components/listitem';
import {View, FlatList, ActivityIndicator, Dimensions} from 'react-native';
import ForestApi from '../tools/apis';
import BuildConfigs from '../config';
import {useTheme} from '@react-navigation/native';
import {ThemedText, Collapsible} from '../components/components';
import { LineChart} from "react-native-chart-kit";
export default function GradeChart(props){
  const {colors} = useTheme();
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState({
    labels: ["1","2","3","4","5"],
    datasets: [
      {
        data: [1,2,3,4,5],
        color: () => colors.primary, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["평점"] // optional
  });
  const screenWidth = Dimensions.get("window").width * 0.95;
  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: () => colors.text,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  useEffect(()=>{
    (async ()=>{
      setIsLoading(true);
      const gradeCert = await ForestApi.get('/grade/certificate', true);
      if(gradeCert.ok){
        const data = await gradeCert.json();        
        let groups = [];
        let detailsData = [];
        let summaryData = {
          labels: [],
          datasets: [
            {
              data: [],
              color: () => colors.primary, // optional
              strokeWidth: 2 // optional
            }
          ],
          legend: ["평점"] // optional
        };
      
        for(const item of data.details){
          if(item.subject.includes("백분율")){
            detailsData.push({
              title: item.subject,
              subjects: []
            })
          }else if(item.subject.includes("취득학점")){
            detailsData.push({
              title: `${item.year}-${item.semester} | ${item.subject}`,
              subjects: groups
            });
            let splited = item.subject.split(" ");
            summaryData.labels.push(`${item.year}-${item.semester}`);
            summaryData.datasets[0].data.push(Number(splited[3]));
            groups = [];
          }else{
            groups.push(item);
          }
        }
        
        setDetails(detailsData);
        setChartData(summaryData);
        setIsLoading(false);
      }
    })();
  }, []);
  
  if(isLoading){
    return(
      <View style={{justifyContent: 'center', padding: 32}}>
        <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
      </View>
    );
  }else{
    return(
      <FlatList style={{height: '100%'}}
        ListHeaderComponent={()=>(
          <View>
            <LineChart
              data={chartData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
            />
          </View>
        )}
        
        data={details}
        renderItem={({item}, index)=>(
          <Collapsible title={item.title}>
            {item.subjects.map((sub)=>(
              <ListItem style={{flex: 0, flexDirection: 'row'}} key={`details${index}`}>
                <View style={{flex: 4}}>
                  <ThemedText style={{fontWeight: 'bold'}}>{sub.subject}</ThemedText>
                  <ThemedText>{sub.code}</ThemedText>
                </View>
                <ThemedText style={{flex: 1}}>{sub.type}</ThemedText>
                <ThemedText style={{flex: 1}}>{sub.credit}</ThemedText>
                <ThemedText style={{flex: 1}}>{sub.grade}</ThemedText>
              </ListItem>
            ))}
          </Collapsible>
        )}
      />
    );
  }
}

