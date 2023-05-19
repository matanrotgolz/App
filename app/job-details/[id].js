import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Company, JobAbout, JobFooter, JobTabs, ScreenHeaderBtn, Specifics } from '../../components';
import  AudioPlayer  from '../../components/AudioPlayer/AudioPlayer.jsx';
import { COLORS, icons, SIZES } from '../../constants';
import { usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFetch from '../../hook/useFetch';

const JobDetails = () => {
  const index = usePathname();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [storedJobs, setStoredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [location, setLocation] = useState(index.split('/')[2]);
  const [Footer,SetFooter] = useState(false);
  const data = [];

  /*
  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: params.id,
  });
  */

  const tabs = ["Listen To The PlayBack", "Summary", "General Details"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // refetch();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    
    const fetchStoredJobs = async () => {
      setIsLoading(true);
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


  }, []);

  useEffect(() => {
    if (activeTab === "Listen To The PlayBack") {
      SetFooter(false);
    } else {
      SetFooter(true);
    }
  }, [activeTab]);

  const displayTabContent = () => {
    switch (activeTab) {
      case "Listen To The PlayBack":
       
        return <AudioPlayer audioUrl={storedJobs.length >0? storedJobs[location]:[]} />
      break;
      case "Summary":
          
    
        return <Text>Hello</Text>;
      break;

      case "General Details":
        return (
          <Text>Bob</Text>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.share}
              dimension="60%"
            />
          ),
          headerTitle: ''
        }}
      />

      <>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something Went Wrong</Text>
          ) : storedJobs.length === 0 ? (
            <Text>No data Available</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
               <Company
                  comapnyLogo={icons.Femto}
                  jobTitle={`Record Number #${location}`}
                  companyName={'Matan'}
                  location={''}
              />
              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              /> 
              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        {Footer? <JobFooter url={storedJobs[location]} />:''}
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
