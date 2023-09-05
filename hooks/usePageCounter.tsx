import { useEffect, useState } from "react"
import { createClient } from '@supabase/supabase-js'
import { getRandomString } from "lib/utils"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

export const usePageCounter = ({ slug }: {
  slug: string
}) => {

  const [pageView, setPageView] = useState(0)
  const [random, setRandom] = useState("")
  console.log("### RANDOM")
  console.log(random)

  // ランダム文字列の発行および取得ロジック
  useEffect(() => {
    console.log("#####")
    const storedRandom = localStorage.getItem('pageCounterRandom');
    console.log(storedRandom)
    if (storedRandom) {
      setRandom(storedRandom)
    } else {
      const newRandom = getRandomString()
      localStorage.setItem('pageCounterRandom', String(newRandom));
      console.log(newRandom)
      setRandom(String(newRandom))
    }
  }, []);

  const fetchPageView = async (slug: string) => {
    const { data, error } = await supabase
      .from('pageviews')
      .select()
      .eq('slug', slug)
    return { data, error }
  }

  const fetchPageViewDetail = async (slug: string, random: string) => {
    const { data, error } = await supabase
      .from('pageview_details')
      .select()
      .eq('slug', slug)
      .eq('random', random)
      .eq('date', new Date().toISOString())
    return { data, error }
  }

  // NOTE: 本来はdataを型指定するべきだが、supabase loginなど作業が必要なため、一旦anyで判定
  const upsertPageview = async (data: any, slug: string) => {
    let id
    let pageview = 1 // 初期値は0ではなく1
    if (data.length > 0) {
      id = data[0].id
      pageview = data[0].pageview + 1 // increment
    }
    const { data: dataUpsert, error: errorUpsert } = await supabase
      .from('pageviews')
      .upsert({
        id: id,
        slug: slug,
        pageview: pageview
      })
      .select()
    return { dataUpsert, errorUpsert }
  }

  const insertPageViewDetail = async (slug: string, random: string) => {
    const { error } = await supabase
      .from('pageview_details')
      .insert({
        slug: slug,
        random: random,
        date: new Date().toISOString()
      })
    return { error }
  }

  useEffect(() => {
    if (random === "") {
      return
    }

    const executePageCounter = async () => {

      let { data, error } = await fetchPageView(slug)
      let { data: detailData, error: detailError } = await fetchPageViewDetail(slug, random)
      if (error || data == undefined || detailError || detailData == undefined) {
        // add error handling if needed
        return
      }
      // 既に詳細データがある場合は、何もしないで終了する
      if (data.length > 0 && detailData.length > 0) {
        setPageView(data[0].pageview);
        return
      }

      //　データがない場合は新規作成する
      await insertPageViewDetail(slug, random)
      const { dataUpsert, errorUpsert } = await upsertPageview(data, slug)
      if (errorUpsert || dataUpsert == undefined) {
        // add error handling if needed
        return
      }

      // 処理が終わってからpageviewを更新
      setPageView(dataUpsert[0].pageview);
    }

    executePageCounter()
  }, [random])

  return [{ pageView }]
}
