import React from 'react';

function Cards() {
  return (
    <div className="row">
      <div className="col-xl-3 col-md-6">
        <div className="card bg-primary text-white mb-4">
          <div className="card-body">Primary Card</div>
          <div className="card-footer d-flex align-items-center justify-content-between">
            <a className="small text-white stretched-link" href="#">View Details</a>
            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
          </div>
        </div>
      </div>
      {/* Other cards... */}
    </div>
  );
}

export default Cards;