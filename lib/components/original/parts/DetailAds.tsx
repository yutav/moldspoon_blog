import GoogleAdsense from "./GoogleAdsense";
type Prop = {
}

const DetailAds: React.FC<Prop> = () => {



  return (
    <div
      className="block lg:fixed lg:left-6 lg:top-6"
    >
      <div className="px-6 py-2 max-h-20"
        style={{ minWidth: '300px' }}
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

    </div>
  )
}

export default DetailAds