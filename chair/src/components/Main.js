import '../App.css';
import PlaceholderComponent from './PlaceholderComponent';
import { Chart } from "react-google-charts";
import Spine from "./Spine";
import { useState, useEffect, useRef } from 'react';
import image from '../skeleton.jpg' // relative path to image 
import { Grid } from '@mui/material'

export default function Main() {    

    // const [postureData, setPostureData] = useState([]);
    const postureDataRef = useRef([])
    const spinePointRef = useRef(0)

    const updateData = async () => {
        console.log("Fetching");
        await fetch("http://127.0.0.1:5000/get_pose_data")
            .then((response) => response.json())
            .then((data) => {
                postureDataRef.current = data

                console.log("scores " + postureDataRef.current)
            })
            .catch((err) => {
                // setWeatherType("ERROR");
                console.log(err)
            });

        await fetch("http://127.0.0.1:5000/get_spine_data")
            .then((response) => response.json())
            .then((data) => {
                spinePointRef.current = data

                console.log("spinePoint " + spinePointRef.current)

            })
            .catch((err) => {
                // setWeatherType("ERROR");
                console.log(err)
            });
    };

    useEffect(() => {
        // Fetch data initially
        updateData();

        // Fetch data every second
        const intervalId = setInterval(updateData, 1000);

        // Cleanup function
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // while ()
    // updateData();
    console.log("main again")
    return (
        <div className="App">
  <header className="main-header">
    <div className='main-title'>
      <h1 className='title'>chAIr</h1>
    </div>
    <div className='popping-question'>
      What can your chair do for you?
    </div>
    <div className="main-content">
    <PlaceholderComponent>
  <div className="spine-wrapper">
    <Spine spinePoint={spinePointRef} />
  </div>
</PlaceholderComponent>

      <PlaceholderComponent content="Dynamic Content 1" />
      <PlaceholderComponent content="Dynamic Content 2" />
    </div>
  </header>
</div>

    );
}