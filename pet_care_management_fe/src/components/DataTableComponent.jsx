import React, { useEffect } from 'react';
import { DataTable } from 'simple-datatables';

function DataTableComponent() {
  useEffect(() => {
    const dataTable = new DataTable('#datatablesSimple');
    return () => {
      dataTable.destroy();
    };
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-table me-1"></i>
        DataTable Example
      </div>
      <div className="card-body">
        <table id="datatablesSimple">
          {/* Table content... */}
        </table>
      </div>
    </div>
  );
}

export default DataTableComponent;