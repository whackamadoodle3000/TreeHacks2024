import '../App.css';
import { Chart } from "react-google-charts";
import Spine from "./Spine";
// import ApexChart from "./Chart"
import { useState } from 'react';

function Main() {

    const [postureData, setPostureData] = useState([]);
    
    const updateData = async () => {
        console.log("Fetching");
        await fetch("http://127.0.0.1:5000/get_pose_data")
            .then((response) => response.json())
            .then((data) => {
                // console.log(data[0])
                setPostureData(data)
                // const postureData = JSON.parse(data);
                console.log(postureData)
            })
            .catch((err) => {
                // setWeatherType("ERROR");
                console.log(err)
            });

        await fetch("http://127.0.0.1:5000/get_spine_data")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
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

    // while ()
    updateData();
    console.log("main again")
    return (
        <div className="App">
            <header className="main-header">
                <div className='main-title'>
                    <h1 className='title'>CHAIR</h1>
                </div>
                <div className='spine'>
                    <Spine/>
                </div>

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

export default Main;
