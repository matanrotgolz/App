import { View,Text,ScrollView,SafeAreaView } from "react-native";
import { useState,useEffect } from "react";
import {Stack,useRouter} from 'expo-router';
import {COLORS,icons,images,SIZES} from '../constants';
import {Nearbyjobs,Popularjobs,ScreenHeaderBtn,Welcome} from '../components';
import RecordButton from '../components/RecordButton/RecordButton.jsx';
const Home = () =>{
    const router = useRouter();
    const [searchTerm,setSearchTerm] = useState("")
    const [newSave,setNewSave] = useState(false)

    const handleNewSave = (state) =>{
        setNewSave(state)
        setTimeout(()=>{
            setNewSave(false)
        },20)
    }

    return (
        <SafeAreaView
            style={{
                flex:`1`,
                backgroundColor: COLORS.lightWhite,

            }}
        >
           <Stack.Screen
            options={{
                headerStyle:{
                    backgroundColor:COLORS.lightWhite,
                },
                headerShadowVisible:false,
                headerLeft:()=>(
                  <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%"/>  
                ),
                headerRight:()=>(
                    <ScreenHeaderBtn iconUrl={images.profile} dimension="100%"/>  
                ),
                headerTitle:"",
            }}
           />
           <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{
                flex:1,
                padding:SIZES.medium,
            }}>
                <Welcome
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleClick={()=>{
                        if(searchTerm){
                            router.push(`/search/${searchTerm}`)
                        }
                    }}
                    
                />
                <RecordButton onSavedRecord={handleNewSave} />
                <Popularjobs/>
                <Nearbyjobs newSave={newSave}/>
            </View>
           </ScrollView>
        </SafeAreaView>
    )
}

export default Home;