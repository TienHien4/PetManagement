import React, { useEffect } from 'react';
import Cards from './Cards';
import Charts from './Charts';
import DataTable from './DataTableComponent';

function DashboardContent() {
  useEffect(() => {
    // Initialize any necessary scripts
  }, []);

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Dashboard</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
        <Cards />
        <Charts />
        <DataTable />
      </div>
    </main>
  );
}

export default DashboardContent;