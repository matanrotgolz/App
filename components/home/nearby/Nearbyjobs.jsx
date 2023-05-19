import React,{useEffect,useState } from 'react'
import { View, Text,TouchableOpacity,ActivityIndicator } from 'react-native'
import { useRouter} from 'expo-router'
import { COLORS } from '../../../constants'
import styles from './nearbyjobs.style'
import NearbyJobCard from '../../common/cards/nearby/NearbyJobCard'
import useFetch from '../../../hook/useFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Nearbyjobs = ({newSave}) => {
  const router = useRouter();
  const [storedJobs, setStoredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const random =()=>{
    return Math.floor(Math.random()*100)
  }

  const handlePress =()=>{
    setOpen(!open)
  }
  /*
  const {data,isLoading,error} = useFetch(
    'search',{
      query:'React Developer',
      num_page:1
    }
  )
*/


useEffect(() => {
  const fetchStoredJobs = async () => {
    setIsLoading(true)
    try {
      const storedJobsJson = await AsyncStorage.getItem('storedRecords');
      const storedJobsData = JSON.parse(storedJobsJson);
      setStoredJobs(storedJobsData || []); // If storedJobsData is null or undefined, set it as an empty array
      setIsLoading(false);
    } catch (err) {
      console.error('Error retrieving stored jobs:', err);
      setError(true);
      setIsLoading(false);
    }
  };

  fetchStoredJobs();

}, [newSave]);



return (

  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Recent Recordings</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.headerBtn}>{`Show All (${storedJobs.length}) `}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : error ? (
        <Text>Something Went Wrong</Text>
      ) : 
      open ?
      storedJobs.length >0?(
        storedJobs.map((audio,index) => (
          
          <NearbyJobCard
            number={index}
            audio={audio}
            key={`nearby-job-${index+1}`}
            handleNavigate={() => router.push(`/job-details/${index}`)}
          />
        
        ))
      ):<Text>No Recordings Has Been Found</Text>:<Text></Text>}
    </View>
  </View>
);

}

export default Nearbyjobs