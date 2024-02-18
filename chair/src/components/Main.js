import '../App.css';
import PlaceholderComponent from './PlaceholderComponent';
import { useState, useEffect, useRef } from 'react';
import Spine from "./Spine";
// import ApexChart from "./Chart"
import { LineChart, Line } from 'recharts';
import image from '../skeleton.jpg' // relative path to image

function Main() {

    const postureDataRef = useRef([])
    const spinePointRef = useRef(0)
    
    const updateData = async () => {
        console.log("Fetching");
        await fetch("http://127.0.0.1:5000/get_pose_data")
            .then((response) => response.json())
            .then((data) => {
                postureDataRef.current = data
                console.log("scores " + postureDataRef.current)
                // const postureData = JSON.parse(data);
                // console.log(postureData)
            })
            .catch((err) => {
                // setWeatherType("ERROR");
                console.log(err)
            });

        await fetch("http://127.0.0.1:5000/get_spine_data")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                spinePointRef.current = data // Correctly set spine data here


                // setPostureData(data)
                // const postureData = JSON.parse(data);
                // console.log(postureData)
            })
            .catch((err) => {
                // setWeatherType("ERROR");
                console.log(err)
            });
            // setTimeout(updateData, 1000);
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
                    <h1 className='title'>CHAIR</h1>
                </div>
                <div className="main-content">
                    <div className="spine">
                        <Spine spinePoint={spinePointRef} />
                    </div>
                    <PlaceholderComponent content="Dynamic Content 1" />
                    <PlaceholderComponent content="Dynamic Content 2" />
                </div>

                <img src={`${image}?${new Date().getTime()}`} />
                
                <LineChart width={400} height={400} data={postureDataRef.current}>
                    <Line type="monotone" dataKey="back_align" stroke="#8884d8" />
                    <Line type="monotone" dataKey="shoulder_align" stroke="#f884d8" />
                    <Line type="monotone" dataKey="neck_align" stroke="#d884d8" />
                </LineChart>
            </header>
        </div>
    );
}
export default Main;
