import React, { useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";

const ShowPreview = ({ visible, onHide, selectedDesign, previewSheets, inputs, serverPort }) => {
  const canvasRefs = useRef({});

  if (!visible || !selectedDesign) return null;

  const matchedPreviews = previewSheets.filter(p => p.name === selectedDesign.name);

  const fallbackHotspots = {};
  previewSheets.forEach(p => {
    if (p.hotspots?.length) {
      const category = p.category;
      if (!fallbackHotspots[category]) fallbackHotspots[category] = [];
      fallbackHotspots[category].push(p.hotspots);
    }
  });

  useEffect(() => {
    matchedPreviews.forEach(preview => {
      const canvas = canvasRefs.current[preview.id];
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const baseImg = new Image();
      baseImg.crossOrigin = "anonymous";
      baseImg.src = preview.imageUrl;

      baseImg.onload = () => {
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        const hotspotsToUse = preview.hotspots?.length
          ? preview.hotspots
          : fallbackHotspots[preview.category]?.[0] || [];

        const textInputs = [];
        for (let i = 1; i <= 6; i++) {
          const val = inputs[`Stickers-${i}`];
          if (val && typeof val === "string") textInputs.push(val);
        }

        const loadPromises = hotspotsToUse.map(group => {
          if (group[0].dataType === "image" && inputs["Stickers-0"]?.url) {
            return new Promise(resolve => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = inputs["Stickers-0"].url;

              img.onload = () => {
                const coordsPx = group.map(p => ({
                  x: (p.x / 100) * canvas.width,
                  y: (p.y / 100) * canvas.height
                }));

                const minX = Math.min(...coordsPx.map(p => p.x));
                const maxX = Math.max(...coordsPx.map(p => p.x));
                const minY = Math.min(...coordsPx.map(p => p.y));
                const maxY = Math.max(...coordsPx.map(p => p.y));

                const boxWidth = maxX - minX;
                const boxHeight = maxY - minY;

                ctx.save();
                ctx.beginPath();
                ctx.rect(minX, minY, boxWidth, boxHeight);
                ctx.clip();

                const imgRatio = img.width / img.height;
                const boxRatio = boxWidth / boxHeight;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (imgRatio > boxRatio) {
                  drawHeight = boxHeight;
                  drawWidth = img.width * (boxHeight / img.height);
                  offsetX = minX - (drawWidth - boxWidth) / 2;
                  offsetY = minY;
                } else {
                  drawWidth = boxWidth;
                  drawHeight = img.height * (boxWidth / img.width);
                  offsetX = minX;
                  offsetY = minY - (drawHeight - boxHeight) / 2;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                ctx.restore();
                resolve();
              };
            });
          }
          return Promise.resolve();
        });

        Promise.all(loadPromises).then(() => {
          ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

          let textCounter = 0;
          const textHotspots = hotspotsToUse.filter(g => g[0].dataType === "text");

          hotspotsToUse.forEach(group => {
            if (group[0].dataType === "text") {
              let text = "";

              if (textInputs.length === 0) {
                text = "";
              } else if (textInputs.length === 1) {
                text = textInputs[0];
              } else {
                text = textInputs[textCounter % textInputs.length];
              }

              textCounter++;

              const coordsPx = group.map(p => ({
                x: (p.x / 100) * canvas.width,
                y: (p.y / 100) * canvas.height
              }));

              const minX = Math.min(...coordsPx.map(p => p.x));
              const maxX = Math.max(...coordsPx.map(p => p.x));
              const minY = Math.min(...coordsPx.map(p => p.y));
              const maxY = Math.max(...coordsPx.map(p => p.y));
              const boxWidth = maxX - minX;

              ctx.save();
              ctx.fillStyle = "black";
              ctx.font = "bold 35px Cambria";
              ctx.textAlign = "left";
              ctx.textBaseline = "top";

              const words = text.split(" ");
              let line = "";
              const lineHeight = 50;
              let y = minY;

              for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + " ";
                const metrics = ctx.measureText(testLine);

                if (metrics.width > boxWidth && i > 0) {
                  ctx.fillText(line.trim(), minX, y, boxWidth);
                  line = words[i] + " ";
                  y += lineHeight;
                  if (y > maxY) break;
                } else {
                  line = testLine;
                }
              }

              if (y <= maxY) {
                ctx.fillText(line.trim(), minX, y, boxWidth);
              }

              ctx.restore();
            }
          });
        
        });

      };

      
    });
  }, [matchedPreviews, inputs, selectedDesign, serverPort, fallbackHotspots]);



  return (
    <Modal show={visible} onHide={onHide} fullscreen centered>
      <Modal.Header closeButton>
        <Modal.Title> {selectedDesign?.name} Sheet Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap justify-content-center"
          onContextMenu={(e) => e.preventDefault()}
        >
          {matchedPreviews.map(preview => (
            <canvas
              key={preview.id}
              ref={el => { if (el) canvasRefs.current[preview.id] = el; }}
              style={{ width: "100%" }}
            />
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};


export default ShowPreview;
