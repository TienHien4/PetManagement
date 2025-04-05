import React, { useEffect } from 'react';
import Cards from './Cards';
import Charts from './Charts';


function DashboardContent() {
  useEffect(() => {

  }, []);

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Thống kê</h1>
        <Cards />
        <Charts />
      </div>
    </main>
  );
}

export default DashboardContent;