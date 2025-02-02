import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import styles from '../../../../styles/mdximage.module.css';
import 'react-image-lightbox/style.css'; // Lightboxのスタイルをインポート
import Lightbox from 'react-image-lightbox';
import { useIsMobile } from 'hooks/useIsMobile';

interface Prop {
  addClass?: string;
  month?: string;
  image: string;
  alt: string;
  width?: number;
  height?: number;
  classStr?: string;
  annotation?: string
  isHalf?: boolean
}

const MdxImage: React.FC<Prop> = ({ addClass, month, image, alt, width, height, classStr, annotation, isHalf }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { isMedium } = useIsMobile()
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

  const altEvaluated = useMemo(() => {
    if (alt) {
      return alt
    }
    else if (annotation) {
      return annotation
    }
    return image
  }, [alt, annotation, image])



  return (
    <div className={styles.imageContainer + ' ' + (addClass ? addClass : '')}>
      {month ? (
        <>
          <div onClick={openLightbox} className='my-10'>
            <Image
              className={`${isHalf ? styles.imageHalf : styles.image} border border-gray-300 shadow-lg cursor-pointer hover:opacity-50 ${classStr}`}
              src={imageUrl}
              alt={altEvaluated}
              layout="fill"
              objectFit="contain"
            />
            {annotation && <p className={(isHalf && "w-1/2") + " text-xs text-center italic"}>{annotation}</p>}
          </div>
          {lightboxOpen && (
            <Lightbox
              mainSrc={imageUrl}
              onCloseRequest={closeLightbox}
              imageTitle={alt}
              imagePadding={isMedium ? 10 : 100}
              enableZoom={true}
            />
          )}
        </>
      ) : (
        <Image
          className={`${styles.image} ${classStr}`}
          src={imageUrl}
          alt={altEvaluated}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default MdxImage;
