import React from 'react'
import Image from "next/image"
import styles from "../../../../styles/mdximage.module.css"

interface Prop {
  addClass?: string
  month?: string
  image: string
  alt: string
  width?: number
  height?: number
  classStr?: string
}

const MdxImage: React.FC<Prop> = ({ addClass, month, image, alt, width, height, classStr }) => {

  let imageUrl
  if (month) {
    imageUrl = process.env.baseUrl + "/posts/images/" + month + "/" + image
  }
  else {
    imageUrl = process.env.baseUrl + "/posts/images/" + image
  }

  return (
    <div className={styles.imageContainer + " " + (addClass ? addClass : "")
    }>
      {
        month ? (
          <Image
            className={styles.image + " " + classStr}
            src={imageUrl}
            alt={alt}
            layout={"fill"}
            objectFit={"contain"}
          />
        ) : (
          <Image
            className={styles.image + " " + classStr}
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
          />
        )}
    </div >

  );
}
export default MdxImage