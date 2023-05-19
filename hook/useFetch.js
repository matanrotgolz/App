import {useState,useEffect} from 'react'
import axios from 'axios';


const useFetch = (endpoint,query) =>{
    const [data,setData] =useState([]);
    const [isLoading,SetLoading] = useState(false);
    const [error,setError] = useState(false);
    
    const options = {
        method: 'GET',
        url: `https://jsearch.p.rapidapi.com/${endpoint}`,     
        headers: {
          'X-RapidAPI-Key':'54181da9f9msha846b720241f411p1ba6f7jsn1d016a069542' ,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        },
        params: {
             ...query
        },
   
    };

    const FetchData = async  () =>{
        SetLoading(true);
        try{
            const response = await axios.request(options)
            setData(response.data.data)
            SetLoading(false)
        }
        catch (error){
            setError(error)
            alert('There is an error')
        }

        finally{
            SetLoading(false)
        }
    }


    useEffect(()=>{
        FetchData();
    },[]);

    const refetch = () =>{
        SetLoading(true);
        FetchData();
    }

    return{
        data,isLoading,error,refetch
    }
}


export default useFetch