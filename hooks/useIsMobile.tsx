import { useEffect, useState } from "react"


export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMedium, setIsMedium] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const mediumBreakpoint = window.matchMedia("(max-width: 1024px)").matches;
      const smallBreakpoint = window.matchMedia("(max-width: 768px)").matches;

      setIsMobile(smallBreakpoint);
      setIsMedium(mediumBreakpoint);
    };

    // 初期チェックを行う
    checkIsMobile();

    // ウィンドウのリサイズ時にチェックを再実行
    window.addEventListener("resize", checkIsMobile);

    // クリーンアップ関数
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return { isMobile, isMedium };
}
