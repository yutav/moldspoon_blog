import GoogleAdsense from "./GoogleAdsense";
type Prop = {
}

const DetailAds: React.FC<Prop> = () => {

  return (
    <div
      className="detailAdBox z-10"

    >
      <div className="px-6 py-2 max-h-20"
        style={{ minWidth: '250px' }}
      >
        {/* blog-top-square */}
        {process.env.NODE_ENV == 'production' && (
          <GoogleAdsense
            client="ca-pub-1104475365452915" //
            slot="6371182287"
            style={{ display: 'block' }}
          />
        )}

      </div>
      <style jsx>{`
        .detailAdBox {
          position: relative;
        }
        @media (min-width: 1536px) {
          .detailAdBox {
            position: fixed;
            left: 2rem;
            top: 2rem;
          }
        }
      `}
      </style>
    </div>
  )
}

export default DetailAds