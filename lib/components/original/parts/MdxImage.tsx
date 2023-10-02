import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../../../../styles/mdximage.module.css';
import 'react-image-lightbox/style.css'; // Lightboxのスタイルをインポート
import Lightbox from 'react-image-lightbox';

interface Prop {
  addClass?: string;
  month?: string;
  image: string;
  alt: string;
  width?: number;
  height?: number;
  classStr?: string;
}

const MdxImage: React.FC<Prop> = ({ addClass, month, image, alt, width, height, classStr }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const baseUrl = process.env.baseUrl || ''; // ベースURLを適切に設定する必要があります

  let imageUrl;
  if (month) {
    imageUrl = `${baseUrl}/posts/images/${month}/${image}`;
  } else {
    imageUrl = `${baseUrl}/posts/images/${image}`;
  }

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className={styles.imageContainer + ' ' + (addClass ? addClass : '')}>
      <div onClick={openLightbox}>
        {month ? (
          <Image
            className={`${styles.image} my-10 border border-gray-300 shadow-lg ${classStr}`}
            src={imageUrl}
            alt={alt}
            layout="fill"
            objectFit="contain"
          />
        ) : (
          <Image
            className={`${styles.image} ${classStr}`}
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
          />
        )}
      </div>
      {lightboxOpen && (
        <Lightbox
          mainSrc={imageUrl}
          onCloseRequest={closeLightbox}
          imageTitle={alt}
          enableZoom={true}
        />
      )}
    </div>
  );
};

export default MdxImage;
