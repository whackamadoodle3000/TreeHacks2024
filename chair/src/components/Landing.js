import chair from '../chair.png'
import '../App.css';
import {Link} from 'react-router-dom';
import Particles, {initParticlesEngine} from "@tsparticles/react";
import {loadFull} from "tsparticles";
import {useState, useEffect} from 'react'
import "../App.css";
import particlesOptions from "../particles.json";


function Landing() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (init) {
            return;
        }

        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    return (
      <div className="App">
  
        <img className='background-chair' src={chair}/>
        {init && <Particles options={particlesOptions}/>}
        <header className="landing-header">
          <div className='landing-title'>
            <h1 className='title landing-chr'>CH</h1>
            <h1 className='title gradient'>AI</h1>
            <h1 className='title landing-chr'>R</h1>
          </div>
          <p>What can your chair do for you?</p>
          <Link to="main"><button className='button'><div className='button-text'>Go</div></button></Link>
        </header>
      </div>
    );
}

export default Landing;
