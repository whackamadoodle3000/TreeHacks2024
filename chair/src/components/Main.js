// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import '../App.css';
import Spine from "./Spine";
import { useState, useEffect } from 'react';
import image from '../skeleton.jpg' // relative path to image 
import { Grid } from '@mui/material'
import React from 'react';
import { LineChart, Line } from 'recharts';

function Main() {

    const [postureData, setPostureData] = useState([]);
    const [spinePoint, setSpinePoint] = useState(-2);

    const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, 
    { name: 'Page B', uv: 800, pv: 3600, amt: 4800 },
    { name: 'Page B', uv: 5600, pv: 1080, amt: 5600 },
];


    const updateData = async () => {
        console.log("Fetching");
        await fetch("http://127.0.0.1:5000/get_pose_data")
            .then((response) => response.json())
            .then((data) => {
                // console.log(data[0])
                setPostureData(data)
                // const postureData = JSON.parse(data);
                // console.log("scores " + postureData)
            })
            .catch((err) => {
                // setWeatherType("ERROR");
                console.log(err)
            });

        await fetch("http://127.0.0.1:5000/get_spine_data")
            .then((response) => response.json())
            .then((data) => {
                console.log("point " + data)
                // var point = data;
                // point = data;

                // this.setState({spinePoint : data})
                setSpinePoint(data)

                // console.log("spinePoint " + spinePoint)
                // setPostureData(data)
                // const postureData = JSON.parse(data);
                // console.log(postureData)
            })
            .catch((err) => {
                // setWeatherType("ERROR");
                console.log("error " + err)
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

    return (
        <div className="Posture Analysis Platform">
            <header className="main-header">
                <div className='main-title'>
                    <h1 className='title'>CHAIR</h1>
                </div>
                <Grid></Grid>
                <div className='spine'>
                    <Spine spinePoint={spinePoint} />
                </div>

                <img src={`${image}?${new Date().getTime()}`} />
                
                <LineChart width={400} height={400} data={data}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                </LineChart>
            </header>
        </div>
    );
}

export default Main;
