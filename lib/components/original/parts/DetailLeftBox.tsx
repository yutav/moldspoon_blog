import { useIsMobile } from "hooks/useIsMobile";
import DetailAds from "./DetailAds";
type Prop = {
  detailContents: React.ReactNode
}

const DetailLeftBox: React.FC<Prop> = ({ detailContents }) => {
  const { isMedium } = useIsMobile()

  return (
    <div
      className="detailLeftBox z-10"
    >
      {detailContents}
      {(process.env.NODE_ENV == 'production' && isMedium == false) && (
        <DetailAds />
      )}
      <style jsx>{`
        .detailLeftBox {
          position: relative;
        }
        @media (min-width: 1600px) {
          .detailLeftBox {
            position: fixed;
            left: 0.5rem;
            top: 0.5rem;
          }
        }
      `}
      </style>
    </div>
  )
}

export default DetailLeftBox