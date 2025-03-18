import React, { useState } from 'react';
import ImageCanvas from './Image_Canvas';
import GraphComponent from './Graph';

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [graph, setGraph] = useState(null);

  return (
    <div>
      <h1>Lab Map Navigation</h1>
      <ImageCanvas setNodes={setNodes} setGraph={setGraph} />
      {graph && <GraphComponent nodes={nodes} graph={graph} />}
    </div>
  );
};

export default App;