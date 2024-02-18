import '../App.css';
import { useEffect, useRef} from 'react';
import Spine from "./Spine";
import {LineChart, Line} from 'recharts';
import image from '../skeleton.png';

function Main() {

    const postureDataRef = useRef([])
    const spinePointRef = useRef(0)

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

        // Fetch data every second
        const intervalId = setInterval(updateData, 1000);

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
                    <LineChart width={250} height={300} data={postureDataRef.current}>
                        <Line type="monotone" dataKey="back_align" stroke="#8884d8" dot={false} />
                        <Line type="monotone" dataKey="shoulder_align" stroke="#f884d8" dot={false} />
                        <Line type="monotone" dataKey="neck_align" stroke="#d884d8" dot={false} />
                    </LineChart>
                </div>
            </section >
        </div >
    );

}

export default Main;
