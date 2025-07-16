import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "../../services/customizeAxios";

const Charts = () => {
  const areaRef = useRef(null);
  const barRef = useRef(null);

  // Hàm fetch dữ liệu order và render chart
  const fetchOrderStats = async () => {
    let areaChart = null;
    let barChart = null;
    try {
      const res = await axios.get("/api/orders");
      console.log("Dữ liệu orders:", res.data);
      const orders = res.data;
      // Lấy totalPrice theo tháng (dạng yyyy-MM, luôn 2 số)
      const monthMap = {};
      orders.forEach(order => {
        if (!order.orderDate) return;
        const d = new Date(order.orderDate);
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const key = `${d.getFullYear()}-${month}`;
        monthMap[key] = (monthMap[key] || 0) + order.totalPrice;
      });
      // Sắp xếp theo thời gian thực tế
      const monthLabels = Object.keys(monthMap).sort((a, b) => new Date(a + '-01') - new Date(b + '-01'));
      const monthData = monthLabels.map(k => monthMap[k]);

      // Lấy totalPrice theo năm
      const yearMap = {};
      orders.forEach(order => {
        if (!order.orderDate) return;
        const d = new Date(order.orderDate);
        const key = `${d.getFullYear()}`;
        yearMap[key] = (yearMap[key] || 0) + order.totalPrice;
      });
      const yearLabels = Object.keys(yearMap).sort((a, b) => Number(a) - Number(b));
      const yearData = yearLabels.map(k => yearMap[k]);

      // Vẽ biểu đồ area (theo tháng)
      if (areaRef.current) {
        const areaCtx = areaRef.current.getContext("2d");
        if (areaRef.current._chartInstance) areaRef.current._chartInstance.destroy();
        areaChart = new Chart(areaCtx, {
          type: "line",
          data: {
            labels: monthLabels,
            datasets: [{
              label: "Tổng doanh thu theo tháng",
              backgroundColor: "rgba(2,117,216,0.2)",
              borderColor: "rgba(2,117,216,1)",
              data: monthData,
            }],
          },
          options: {
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
        areaRef.current._chartInstance = areaChart;
      }
      // Vẽ biểu đồ bar (theo năm)
      if (barRef.current) {
        const barCtx = barRef.current.getContext("2d");
        if (barRef.current._chartInstance) barRef.current._chartInstance.destroy();
        barChart = new Chart(barCtx, {
          type: "bar",
          data: {
            labels: yearLabels,
            datasets: [{
              label: "Tổng doanh thu theo năm",
              backgroundColor: "rgba(2,117,216,1)",
              data: yearData,
            }],
          },
          options: {
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
        barRef.current._chartInstance = barChart;
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu orders:", err);
    }
  };

  useEffect(() => {
    fetchOrderStats();
    // Cleanup on unmount
    return () => {
      if (areaRef.current && areaRef.current._chartInstance) areaRef.current._chartInstance.destroy();
      if (barRef.current && barRef.current._chartInstance) barRef.current._chartInstance.destroy();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "80%", maxWidth: "600px", background: "white", padding: "20px", margin: "20px 0", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h3>Bảng thống kê doanh thu theo tháng</h3>
        <canvas ref={areaRef} id="myAreaChart"></canvas>
      </div>
      <div style={{ width: "80%", maxWidth: "600px", background: "white", padding: "20px", margin: "20px 0", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h3>Bảng thống kê doanh thu theo năm</h3>
        <canvas ref={barRef} id="myBarChart"></canvas>
      </div>
    </div>
  );
};

export default Charts;
