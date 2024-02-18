import '../App.css';
import { useEffect, useRef } from 'react';
import Spine from "./Spine";
import { LineChart, XAxis, YAxis, Line, Label } from 'recharts';
import { VictoryChart, VictoryLabel, VictoryAxis, VictoryLine } from 'victory';
import image from '../skeleton.jpg'

function Main() {
    const postureDataRef = useRef([])
    const spinePointRef = useRef(0)

    const data = [
        { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 800, pv: 3600, amt: 4800 },
        { name: 'Page C', uv: 5600, pv: 1080, amt: 5600 },
    ]; // TODO: REMOVE

    const updateData = async () => {
        console.log("Fetching");
        await fetch("http://127.0.0.1:5000/get_pose_data")
            .then((response) => response.json())
            .then((data) => {
                // console.log(data[0])
                postureDataRef.current = data
                // console.log (setPostureData(data))
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
                spinePointRef.current = data
                console.log("spinePoint " + spinePointRef.current)

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

        // Fetch data every 0.5 s
        const intervalId = setInterval(updateData, 500);

        // Cleanup function
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const Placeholder = ({ title }) => (
        <div className="placeholder">
            <h2>{title}</h2>
            <p>Placeholder content for {title}</p>
        </div>
    );

    return (

        <div className="App">
            <section className="horizontal-section">
                <div className="column">
                    <div className="placeholder">
                        <Spine spinePoint={spinePointRef.current} style={{ width: '33%', height: '33%' }} />
                    </div>
                </div>
                <div className="column">
                    <Placeholder title="Section 1, Column 2" />
                </div>
            </section>

            <section className="horizontal-section">
                <div className="column">
                    <div className="placeholder">
                        <img src={`${image}?${new Date().getTime()}`} alt="Skeleton" />
                    </div>
                    <div className="placeholder"></div>
                    <VictoryChart width={400} height={400}>
                        <VictoryLabel x={200} y={30} text="Posture Scoring" textAnchor="middle" />
                        <VictoryLine data={postureDataRef.current} x="name" y="shoulder_align" style={{ data: { stroke: "#c84d8f" } }} />
                        <VictoryLine data={postureDataRef.current} x="name" y="back_align" style={{ data: { stroke: "#4b0082" } }} />
                    </VictoryChart>
                </div>
            </section >
        </div >
    );

}

export default Main;