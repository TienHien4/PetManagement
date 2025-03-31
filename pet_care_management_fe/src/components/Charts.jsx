import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function Charts() {
  useEffect(() => {
    // Area Chart
    const areaCtx = document.getElementById('myAreaChart');
    new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13"],
        datasets: [{
          label: "Sessions",
          lineTension: 0.3,
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(2,117,216,1)",
          pointBorderColor: "rgba(255,255,255,0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(2,117,216,1)",
          pointHitRadius: 50,
          pointBorderWidth: 2,
          data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
        }],
      },
      options: {
        scales: {
          x: {
            time: {
              unit: 'date'
            },
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          },
          y: {
            ticks: {
              min: 0,
              max: 40000,
              maxTicksLimit: 5
            },
            grid: {
              color: "rgba(0, 0, 0, .125)",
            }
          },
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    // Bar Chart
    const barCtx = document.getElementById('myBarChart');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [{
          label: "Revenue",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: [4215, 5312, 6251, 7841, 9821, 14984],
        }],
      },
      options: {
        scales: {
          x: {
            time: {
              unit: 'month'
            },
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 6
            }
          },
          y: {
            ticks: {
              min: 0,
              max: 15000,
              maxTicksLimit: 5
            },
            grid: {
              display: true
            }
          },
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }, []);

  return (
    <div className="row">
      <div className="col-xl-6">
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-chart-area me-1"></i>
            Area Chart Example
          </div>
          <div className="card-body"><canvas id="myAreaChart" width="100%" height="40"></canvas></div>
        </div>
      </div>
      <div className="col-xl-6">
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-chart-bar me-1"></i>
            Bar Chart Example
          </div>
          <div className="card-body"><canvas id="myBarChart" width="100%" height="40"></canvas></div>
        </div>
      </div>
    </div>
  );
}

export default Charts;