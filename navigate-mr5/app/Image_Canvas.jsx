import React, { useRef, useState } from 'react';
import cv from "@techstark/opencv-js"

const ImageCanvas = ({ setNodes, setGraph }) => {
/*
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (canvasRef.current && image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Process image using OpenCV.js
        let src = cv.imread(canvas);
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.Canny(src, dst, 100, 200);  // Edge detection
        cv.imshow(canvas, dst);  // Show processed image
        src.delete(); dst.delete();

        // Extract nodes (for simplicity, let's assume we get some random points)
        const nodes = getNodesFromCanvas(canvas);
        setNodes(nodes);
        setGraph(createGraph(nodes));  // Create graph from nodes
      };
    }
  };

  // Simple function to extract nodes (here, just random points for demo)
  const getNodesFromCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const nodes = [];

    for (let x = 0; x < canvas.width; x += 20) {
      for (let y = 0; y < canvas.height; y += 20) {
        const index = (y * canvas.width + x) * 4;
        const pixel = imageData.data.slice(index, index + 4);
        if (pixel[0] < 100) {  // Example condition for finding edges (non-white pixels)
          nodes.push({ x, y });
        }
      }
    }
    return nodes;
  };

  // Basic graph creation (just for demo purposes)
  const createGraph = (nodes) => {
    let graph = {};
    nodes.forEach((node, idx) => {
      graph[node] = nodes.filter((_, jdx) => idx !== jdx);
    });
    return graph;
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={processImage}>Process Image</button>
      <canvas ref={canvasRef} />
    </div>
  );*/
};

export default ImageCanvas;