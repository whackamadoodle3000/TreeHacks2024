import '../App.css';
import { VictoryChart, VictoryLabel, VictoryAxis, VictoryLine, VictoryLegend } from 'victory';
import Spine from "./Spine";
import { useState, useEffect, useRef } from 'react';
import image from '../skeleton.jpg';

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

    //while()
    //updateData();
    console.log("mainagain")
    return (
        <div className="App">
            <div className="container">
                {/*TitleSegment*/}
                < div className="title-segment" >
                    <h1>chAIr</h1>
                </div >

                {/*AdditionalContentSegment*/}
                < h2 > Spine Sensor</h2 >
                <div className="spine-wrapper" >
                    <Spine spinePoint={spinePointRef} />
                </div >
                <p>Explore how posture affects overall health.</p>

                < h2 > Posture Detection</h2 >
                <div className="spine-wrapper">
                    <img src={`${image}?${new Date().getTime()}`} alt="Skeleton" />
                </div>

                {/* Add the X Axis with a title */}
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
            </div >
        </div >
    );
}
export default Main;