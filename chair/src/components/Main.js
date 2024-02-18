import '../App.css';
import {LineChart, Line} from 'recharts';
import Spine from "./Spine";
import { useState, useEffect, useRef } from 'react';
import image from '../skeleton.jpg';

function Main() {

  const [postureData, setPostureData] = useState([]);
  const [spinePoint, setSpinePoint] = useState([]);
  const postureDataRef = useRef([])
  const spinePointRef = useRef(0)

  const updateData = async () => {
    console.log("Fetching");
    await fetch("http://127.0.0.1:5000/get_pose_data")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data[0])
        postureDataRef.current = data
        console.log(setPostureData(data))
        console.log("scores" + postureDataRef.current)
        //constpostureData=JSON.parse(data);
        //console.log(postureData)
      })
      .catch((err) => {
        //setWeatherType("ERROR");
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

        <div className="spine-wrapper">
        <LineChart width={250} height={300} data={postureDataRef.current}>
                        <Line type="monotone" dataKey="back_align" stroke="#8884d8" dot={false} />
                        <Line type="monotone" dataKey="shoulder_align" stroke="#f884d8" dot={false} />
                        <Line type="monotone" dataKey="neck_align" stroke="#d884d8" dot={false} />
         </LineChart>
        </div>
      </div >
    </div >
  );
}
export default Main;