import { useState } from "react";
import styles from "./photosViewer.module.css";
import { BACK_END_URL } from "../../constants/api";

function PhotosViewer({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className={styles.photosViewer}>
      <div className={styles.mainImage}>
        <img
          src={`${BACK_END_URL}${selectedImage}`}
          className={styles.selectedImage}
        />
      </div>
      <div className={styles.thumbnails}>
        {images.map((imgUrl) => (
          <img
            key={imgUrl}
            src={`${BACK_END_URL}${imgUrl}`}
            className={`${styles.thumbnailImage} ${
              selectedImage === imgUrl ? styles.active : ""
            }`}
            onClick={() => setSelectedImage(imgUrl)}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotosViewer;
