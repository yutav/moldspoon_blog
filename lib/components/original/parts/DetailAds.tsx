import GoogleAdsense from "./GoogleAdsense";
type Prop = {
}

const DetailAds: React.FC<Prop> = () => {

  return (
    <div
      className="detailAd"

    >
      {/* 以前は左脇のフロート枠（幅250px・高さ80px上限）だったが、
          記事末尾の通常フローに置くため本文幅いっぱいに広げる */}
      <div className="px-0 py-2 w-full">
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
        .detailAd {
          position: relative;
          margin-top: 1rem;
        }
      `}
      </style>
    </div>
  )
}

export default DetailAds