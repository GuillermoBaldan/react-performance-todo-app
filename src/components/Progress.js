function Progress({ percentage }) {
    return (
      <div className="progress">
        <h2>Completion: {percentage.toFixed(2)}%</h2>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  }
  
  export default Progress;
  