import '../App.css';
import {LineChart, Line} from 'recharts';
import Spine from "./Spine";
import image from '../skeleton.jpg' // relative path to image
// import ApexChart from "./Chart"
import { Grid, Item } from '@mui/material'
import { useState, useEffect, useRef } from 'react';
import { FaStopwatch } from 'react-icons/fa'

function Main() {

  const [recievedSuggestions, setSuggestions] = useState(false)
  const postureDataRef = useRef([])
  const spinePointRef = useRef(0)

  const updateData = async () => {
    console.log("Fetching");
    await fetch("http://127.0.0.1:5000/get_pose_data")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data[0])
        postureDataRef.current = data
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
                        <p className='caption'>Posture scores</p>
                    </div>
                </Grid>
                <Grid item xs={3} className='grid-item'>
                    <div className='grid-content'>
                        <img className='skeleton' src={`${image}?${new Date().getTime()}`} />
                        <p className='caption'>Skeleton visualization</p>
                    </div>
                </Grid>
                <Grid item xs={3} className='grid-item'>
                    <div className='grid-content'>
                        <Spine className='spine' spinePoint={spinePointRef} />
                        <p className='caption'>Spine pressure map</p>
                    </div>
                </Grid>
                <Grid item xs={6} className='grid-item'>
                    <div className='grid-content'>
                        <p className='caption'>Explore how posture affects overall health</p>
                        {!recievedSuggestions && <FaStopwatch className='timer'/>}
                        {!recievedSuggestions && <p className='gpt-content'></p>}
                    </div>
                </Grid>
                <Grid item xs={6} className='grid-item'>
                    <div className='grid-content'>
                        <p className='large-text'> Chair is a data visualization platform built for a smart chair equipped with pressure sensors and a webcam, whichuses a combination of deep learning and custom regression models to analyze and correct improper posture while sitting in a chair.
                                                <br/><br/>
                                                We equipped a chair with 4 pressure sensors lining the seat back. Using real-time sensor data, we trained a custom deep learning neural network to detect how crooked the spine was when sitting, and identify the most pressurized areas of the spine. The spine animation to the left is an interactive visualization of the most pressurized segments of the spine, where green indicates low and red indicates high pressure. The site also renders a beep to alert the user of poor posture when detected.
                                                <br/><br/>
                                                In the webcam above, we use computer vision techniques to detect and render real-time pose estimations. We overlay the pose estimations on top of the live webcam feed. The line chart to the right displays historical posture scores from the past hour which analyze neck-to-head, back, and shoulder alignment. The higher the score, the better the alignment.</p>
                        <p className='gptContent'></p>
                    </div>
                </Grid>
            </Grid>
            
        </header>
    </div >
  );
}
export default Main;