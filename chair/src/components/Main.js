import '../App.css';
import { Chart } from "react-google-charts";
import Spine from "./Spine";

function Main() {
  return (
    <div className="App">
        <header className="main-header">
            <div className='main-title'>
                <h1 className='title'>CHAIR</h1>
            </div>
            <Spine/>
            <Chart
                chartType="ScatterChart"
                data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
                width="100%"
                height="400px"
                legendToggle
            />
        </header>
    </div>
  );
}

export default Main;
