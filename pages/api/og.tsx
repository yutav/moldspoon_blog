import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og"

export const config = {
  runtime: "edge",
};

console.log(process.env.baseUrl + "/assets/GenJyuuGothic-P-ExtraLight.ttf")

const font = fetch(
  process.env.baseUrl + "/assets/GenJyuuGothic-P-ExtraLight.ttf"
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fontData = await font;

    const options = {
      title: searchParams.get("title")?.slice(0, 100) || "My default title",
      width: Number(searchParams.get("width")) || 1200,
      height: Number(searchParams.get("height")) || 630,
      //      backgroundColor: searchParams.get("backgroundColor") || " bg-white",
      //      textColor: searchParams.get("textColor") || " text-black",
    };

    console.log(options)

    return new ImageResponse(
      (
        <div
          style={{
            backgroundImage: "url(" + process.env.baseUrl + "/assets/moldspoonblog_bg_ogp_base.png)",
            width: '100%',
            height: '100%',
            background: '#FFA500',
            backgroundSize: '100% 100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            border: '20px solid #FFA500',
          }}

        >
          <div
            style={{
              backgroundImage: "url(" + process.env.baseUrl + "/assets/moldspoonblog_bg_ogp_base.png)",
              width: '100%',
              height: '100%',
              background: 'white',
              backgroundSize: '100% 100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              border: '20px solid #FF6600',
              borderRadius: '80px'
            }}
          >
            <div
              style={{
                padding: '0 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                justifyItems: 'center',
                wordWrap: "break-word",
                fontSize: '4rem',
                fontWeight: 'bold',
                lineHeight: '5rem'
              }}
            >
              {options.title}
            </div>
          </div>
        </div>
      ),
      {
        width: options.width,
        height: options.height,
        fonts: [
          {
            name: "GenJyuuGothic",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}