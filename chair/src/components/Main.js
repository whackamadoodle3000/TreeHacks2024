import '../App.css';
import { Chart } from "react-google-charts";
// import
import Spine from "./Spine";
// import ApexChart from "./Chart"
import { useState, useEffect } from 'react';
import { Grid } from '@mui/material'

function Main() {    

    const [postureData, setPostureData] = useState([]);
    const [spinePoint, setSpinePoint] = useState(-2);

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

    // while ()
    // updateData();
    // console.log("main again")
    return (
        <div className="App">
            <header className="main-header">
                <div className='main-title'>
                    <h1 className='title'>CHAIR</h1>
                </div>
                <Grid></Grid>
                <div className='spine'>
                    <Spine spinePoint={spinePoint} />
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
