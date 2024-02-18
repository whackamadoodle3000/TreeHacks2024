import '../App.css';
import {LineChart, Line} from 'recharts';
import Spine from "./Spine";
import image from '../skeleton.jpg' // relative path to image
// import ApexChart from "./Chart"
import { Grid, Item } from '@mui/material'
import { useState, useEffect, useRef } from 'react';

function Main() {

  const [postureData, setPostureData] = useState([]);
  const [spinePoint, setSpinePoint] = useState([]);
  const postureDataRef = useRef([])
  const spinePointRef = useRef(0)

  const updateData = async () => {
    console.log("Fetching");
    await fetch("http://127.0.0.1:5000/get_pose_data")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data[0])
        postureDataRef.current = data
        console.log(setPostureData(data))
        console.log("scores" + postureDataRef.current)
        //constpostureData=JSON.parse(data);
        //console.log(postureData)
      })
      .catch((err) => {
        //setWeatherType("ERROR");
        console.log(err)
      });

    await fetch("http://127.0.0.1:5000/get_spine_data")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        spinePointRef.current = data
        console.log("spinePoint" + spinePointRef.current)

        //setPostureData(data)
        //constpostureData=JSON.parse(data);
        //console.log(postureData)
      })
      .catch((err) => {
        //setWeatherType("ERROR");
        console.log(err)
      });
    //setTimeout(updateData,1000);
  };

  useEffect(() => {
    //Fetchdatainitially
    updateData();

    //Fetchdataeverysecond
    const intervalId = setInterval(updateData, 1000);

    //Cleanupfunction
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="App">
        <header className="main-header">
            <Grid container spacing={2} className='grid'>
                <Grid item xs={12} >
                    <h1 className='main-title'>CH</h1>
                    <h1 className='main-title gradient'>AI</h1>
                    <h1 className='main-title'>R</h1>
                </Grid>
                <Grid item xs={6} className='grid-item'>
                    <div className='grid-content'>
                        <LineChart width={250} height={300} data={postureDataRef.current}>
                                        <Line type="monotone" dataKey="back_align" stroke="#8884d8" dot={false} />
                                        <Line type="monotone" dataKey="shoulder_align" stroke="#f884d8" dot={false} />
                                        <Line type="monotone" dataKey="neck_align" stroke="#d884d8" dot={false} />
                        </LineChart>
                        <p>Explore how posture affects overall health.</p>
                    </div>
                </Grid>
                <Grid item xs={3} className='grid-item'>
                    <div className='grid-content'>
                        <img src={`${image}?${new Date().getTime()}`} />
                        <h2>Skeleton visualization</h2>
                    </div>
                </Grid>
                <Grid item xs={3} className='grid-item'>
                    <div className='grid-content'>
                        <Spine className='spine' spinePoint={spinePointRef} />
                        <h2>Spine pressure map</h2>
                    </div>
                </Grid>
                <Grid item xs={12} className='grid-item'>

                </Grid>
            </Grid>
            
        </header>
    </div >
  );
}
export default Main;