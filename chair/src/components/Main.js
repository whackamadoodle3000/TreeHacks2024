import '../App.css';
import { VictoryChart, VictoryLabel, VictoryAxis, VictoryLine, VictoryLegend } from 'victory';
import Spine from "./Spine";
import image from '../skeleton.jpg' // relative path to image
// import ApexChart from "./Chart"
import { Grid, Item } from '@mui/material'
import { useState, useEffect, useRef } from 'react';
import { FaStopwatch } from 'react-icons/fa'

function Main() {

    const postureDataRef = useRef([])
    const spinePointRef = useRef(0)
    const gptRecRef = useRef("")


    const updateData = async () => {
        console.log("Fetching");
        await fetch("http://127.0.0.1:5000/get_pose_data")
            .then((response) => response.json())
            .then((data) => {
                //console.log(data[0])
                postureDataRef.current = data
                // console.log(setPostureData(data))
                console.log("scores" + postureDataRef.current)
                //constpostureData=JSON.parse(data);
                //console.log(postureData)
            })
            .catch((err) => {
                //setWeatherType("ERROR");
                console.log(err)
            });


        await fetch("http://127.0.0.1:5000/get_gpt_rec")
            .then((response) => response.text())
            .then((data) => {
                console.log(data)
                gptRecRef.current = data // Correctly set spine data here

                console.log("gpt " + gptRecRef.current)

            })
            .catch((err) => {
                // setWeatherType("ERROR");
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
                    <div className="spine-wrapper">
                    <VictoryChart width={400} height={400}>
                        <VictoryLabel x={200} y={30} text="Posture Scoring" textAnchor="middle" />
                        <VictoryAxis
                            label="Time (s)"
                            style={{
                                axisLabel: { padding: 30 } // Adjust the padding as needed
                            }}
                        />

                        {/* Add the Y Axis with a title */}
                        <VictoryAxis
                            dependentAxis
                            label="Alignment Score"
                            style={{
                                axisLabel: { padding: 40 } // Adjust the padding as needed
                            }}
                        />

                        {/* Add the VictoryLegend component */}
                        <VictoryLegend x={400} y={50}
                            title="Legend"
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            style={{ border: { stroke: "black" }, title: { fontSize: 10 } }}
                            data={[
                                { name: "Shoulder", symbol: { fill: "#c84d8f" } },
                                { name: "Back", symbol: { fill: "#4b0082" } }
                            ]}
                        />

                        <VictoryLine data={postureDataRef.current} x="name" y="shoulder_align" style={{ data: { stroke: "#c84d8f" } }} />
                        <VictoryLine data={postureDataRef.current} x="name" y="back_align" style={{ data: { stroke: "#4b0082" } }} />
                    </VictoryChart>
                </div>
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
                        {gptRecRef==="" && <FaStopwatch className='timer'/>}
                        {!gptRecRef==="" && <p className='gpt-content'></p>}
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