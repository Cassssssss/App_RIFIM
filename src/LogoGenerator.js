import React from 'react';

const Logo = () => {
  const downloadSVGAsPNG = (size) => {
    const svg = document.querySelector('svg');
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4f5b93';
    ctx.fillRect(0, 0, size, size);
    
    // Convertir SVG en image
    const data = (new XMLSerializer()).serializeToString(svg);
    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    const url = DOMURL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      DOMURL.revokeObjectURL(url);
      
      // Télécharger l'image
      const imgURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `logo${size}.png`;
      link.href = imgURL;
      link.click();
    };
    img.src = url;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <svg width="512" height="512" viewBox="0 0 512 512" style={{ margin: '20px' }}>
        <rect width="512" height="512" fill="#4f5b93"/>
        <text
          x="256"
          y="256"
          fontFamily="Arial, sans-serif"
          fontSize="280"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          R
        </text>
        <text
          x="256"
          y="350"
          fontFamily="Arial, sans-serif"
          fontSize="80"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          IFIM
        </text>
      </svg>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => downloadSVGAsPNG(192)}
          style={{
            margin: '10px',
            padding: '10px 20px',
            background: '#4f5b93',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Télécharger logo192.png
        </button>
        <button 
          onClick={() => downloadSVGAsPNG(512)}
          style={{
            margin: '10px',
            padding: '10px 20px',
            background: '#4f5b93',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Télécharger logo512.png
        </button>
      </div>
    </div>
  );
};

export default Logo;