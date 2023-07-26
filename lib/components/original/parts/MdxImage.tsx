import React from 'react'
import Image from "next/image"
import styles from "../../../../styles/mdximage.module.css"

interface Prop {
  month: string
  image: string
  alt: string
}

const MdxImage: React.FC<Prop> = ({ month, image, alt }) => {

  return (
    <div className={styles.imageContainer}>
      <Image
        className={styles.image}
        src={process.env.baseUrl + "/posts/images/" + month + "/" + image}
        alt={alt}
        layout="fill"
        objectFit="contain"
      />
    </div>

  );
}
export default MdxImage