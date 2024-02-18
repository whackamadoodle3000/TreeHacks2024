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
import { useEffect, useRef } from 'react';
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

                console.log("spinePoint " + spinePointRef.current)

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