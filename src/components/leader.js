import React from 'react';

const Leaderboard = ({ highScores }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">Leaderboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="font-bold">Rank</div>
        <div className="font-bold">Name</div>
        <div className="font-bold">Score</div>
        {highScores.map((entry, index) => (
          <React.Fragment key={index}>
            <div className="text-lg text-gray-800">{index + 1}</div>
            <div className="text-lg text-gray-800">{entry.name}</div>
            <div className="text-lg text-gray-800">{entry.score}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
