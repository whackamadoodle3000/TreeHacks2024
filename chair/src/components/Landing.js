import chair from '../chair.png'
import '../App.css';
import {Link} from 'react-router-dom';

function Landing() {
    return (
      <div className="App">
  
        <img className='background-chair' src={chair}/>
  
        <header className="landing-header">
          <h1 className='title'>CHAIR</h1>
          <p className='caption'>What can your chair do for you?</p>
          <button><Link to="main">click here</Link></button>
        </header>
        
      </div>
    );
}

export default Landing;