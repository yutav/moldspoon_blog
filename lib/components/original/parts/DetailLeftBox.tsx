import DetailAds from "./DetailAds";
type Prop = {
  detailContents: React.ReactNode
}

const DetailLeftBox: React.FC<Prop> = ({ detailContents }) => {

  return (
    <div
      className="detailLeftBox z-10"
    >
      {detailContents}
      <DetailAds />
      <style jsx>{`
        .detailLeftBox {
          position: relative;
        }
        @media (min-width: 1536px) {
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