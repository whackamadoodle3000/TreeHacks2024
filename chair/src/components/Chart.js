import React from "react";
import { ReactApexChart, moment } from "apexcharts"
import { ReactDOM } from "react";

class ApexChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [
          {
            data: [
              {
                x: 'Analysis',
                y: [
                  new Date('2019-02-27').getTime(),
                  new Date('2019-03-04').getTime()
                ],
                fillColor: '#008FFB'
              },
              {
                x: 'Design',
                y: [
                  new Date('2019-03-04').getTime(),
                  new Date('2019-03-08').getTime()
                ],
                fillColor: '#00E396'
              },
              {
                x: 'Coding',
                y: [
                  new Date('2019-03-07').getTime(),
                  new Date('2019-03-10').getTime()
                ],
                fillColor: '#775DD0'
              },
              {
                x: 'Testing',
                y: [
                  new Date('2019-03-08').getTime(),
                  new Date('2019-03-12').getTime()
                ],
                fillColor: '#FEB019'
              },
              {
                x: 'Deployment',
                y: [
                  new Date('2019-03-12').getTime(),
                  new Date('2019-03-17').getTime()
                ],
                fillColor: '#FF4560'
              }
            ]
          }
        ],
        options: {
          chart: {
            height: 350,
            type: 'rangeBar'
          },
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true,
              dataLabels: {
                hideOverflowingLabels: false
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function(val, opts) {
              var label = opts.w.globals.labels[opts.dataPointIndex]
              var a = moment(val[0])
              var b = moment(val[1])
              var diff = b.diff(a, 'days')
              return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
            },
            style: {
              colors: ['#f3f4f5', '#fff']
            }
          },
          xaxis: {
            type: 'datetime'
          },
          yaxis: {
            show: false
          },
          grid: {
            row: {
              colors: ['#f3f4f5', '#fff'],
              opacity: 1
            }
          }
        },
      
      
      };
    }

  

    render() {
      return (
        <div>
          <div id="chart">
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={350} />
          </div>
          <div id="html-dist"></div>
        </div>
      );
    }
  }

export default ApexChart;
//   const domContainer = document.querySelector('#app');
//   ReactDOM.render(React.createElement(ApexChart), domContainer);