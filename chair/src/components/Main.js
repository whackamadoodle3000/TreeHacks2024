import '../App.css';
import PlaceholderComponent from './PlaceholderComponent';
import { Chart } from "react-google-charts";
import Spine from "./Spine";
// import ApexChart from "./Chart"
import { useState, useEffect, useRef} from 'react';

function Main() {

    const [postureData, setPostureData] = useState([]);
    const [spinePoint, setSpinePoint] = useState([]);
    const spineRef = useRef(null); // Create a ref

    useEffect(() => {
        if (spineRef.current) {
            const spineElement = spineRef.current; // Directly manipulate the DOM element
            // Assuming it's a canvas or similar, adjust its attributes directly
            const targetWidth = 150; // Desired width
            const targetHeight = 150; // Desired height
            spineElement.style.width = `${targetWidth}px`;
            spineElement.style.height = `${targetHeight}px`;
            // If it's a canvas and you need to adjust the drawing scale:
            if (spineElement.tagName === 'CANVAS') {
                spineElement.width = targetWidth;
                spineElement.height = targetHeight;
                // Additional logic to scale/redraw content might be necessary
            }
        }
    }, []); // Empty dependency array means this runs once after initial render

    
    const updateData = async () => {
        console.log("Fetching");
        await fetch("http://127.0.0.1:5000/get_pose_data")
            .then((response) => response.json())
            .then((data) => {
                // console.log(data[0])
                console.log (setPostureData(data))
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
                                setSpinePoint(data); // Correctly set spine data here


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
      <h1 className='title'>chAIr</h1>
    </div>
    <div className='popping-question'>
      What can your chair do for you?
    </div>
    <div className="main-content">
    <PlaceholderComponent>
  <div className="spine-wrapper">
    <Spine spinePoint={spinePoint} />
  </div>
</PlaceholderComponent>

      <PlaceholderComponent content="Dynamic Content 1" />
      <PlaceholderComponent content="Dynamic Content 2" />
    </div>
  </header>
</div>

    );
}

export default Main;
