import '../App.css';
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

    return (
        <div className="Posture Analysis Platform">
            <header className="main-header">
                <div className='main-title'>
                    <h1 className='title'>CHAIR</h1>
                </div>
                <Grid></Grid>
                <div className='spine'>
                    <Spine spinePoint={spinePointRef}/>
                </div>

                <img src={`${image}?${new Date().getTime()}`} />
                {/* <Chart
                    chartType="ScatterChart"
                    data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
                    width="100%"
                    height="400px"
                    legendToggle
                /> */}
                {/* <ApexChart></ApexChart> */}
            </header>
        </div>
    );
}