import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: true, // 永続的なリダイレクトかどうか
      destination: '/posts/add-zod-to-nextjs-project', // リダイレクト先
      // destination: 'https://example.com/' // 別サイトでも指定可能
    },
    // ステータスコードを変更する場合は、`permanent`の代わりに`statusCode`を使用します。
    // redirect: {
    //   statusCode: 302, // ステータスコード指定
    //   destination: '/redirect_page_url', // リダイレクト先
    // },
  }
}

export default function Page() {
  return (
    <>
    </>
  )
}

