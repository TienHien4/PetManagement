import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const Charts = () => {
  useEffect(() => {
    const areaCtx = document.getElementById("myAreaChart").getContext("2d");
    new Chart(areaCtx, {
      type: "line",
      data: {
        labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13"],
        datasets: [{
          label: "Sessions",
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const barCtx = document.getElementById("myBarChart").getContext("2d");
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [{
          label: "Revenue",
          backgroundColor: "rgba(2,117,216,1)",
          data: [4215, 5312, 6251, 7841, 9821, 14984],
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "80%", maxWidth: "600px", background: "white", padding: "20px", margin: "20px 0", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h3>Bảng thống kê doanh thu theo tháng</h3>
        <canvas id="myAreaChart"></canvas>
      </div>
      <div style={{ width: "80%", maxWidth: "600px", background: "white", padding: "20px", margin: "20px 0", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h3>Bảng thống kê doanh thu theo năm</h3>
        <canvas id="myBarChart"></canvas>
      </div>
    </div>
  );
};

export default Charts;
