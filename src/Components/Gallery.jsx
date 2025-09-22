import { useState } from "react";
import { serverPort } from "./Constants";

const Gallery = ({ thumbnailImages }) => {

    const [currentIndex, setCurrentIndex] = useState(0);


    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? thumbnailImages.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === thumbnailImages.length - 1 ? 0 : prev + 1
        );
    };

    if (!thumbnailImages.length) {
        return <p>No images available</p>;
    }


    return (
        <div className="main-gallery-container">
            <div className="gallery-container">
                {/* Main Image */}
                <div className="main-image-wrapper">

                    <img
                        src={`${serverPort}${thumbnailImages[currentIndex].thumbnailUrl}`}
                        // src={`${thumbnailImages[currentIndex].thumbnailUrl}`}
                        alt="Main"
                        className="main-image"
                    />

                </div>

                {/* Thumbnails */}
                <div className="thumbnails">
                    {thumbnailImages.map((img, idx) => (
                        <img
                            key={idx}
                            // src={`${serverPort}${img.thumbnailUrl}`}
                            src={`${img.thumbnailUrl}`}
                            alt={`Thumbnail ${idx}`}
                            className={`thumbnail ${idx === currentIndex ? "active" : ""
                                }`}
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>

    );
};

export default Gallery;
