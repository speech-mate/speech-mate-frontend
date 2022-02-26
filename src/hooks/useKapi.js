import { useEffect, useState } from "react";

function useKapi() {
  const [kapi, setKapi] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");

    script.onload = handleLoad;
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleLoad() {
    if (!window.Kakao) return;

    window.Kakao.init(process.env.REACT_APP_KAKAO_KEY);

    if (window.Kakao.isInitialized()) {
      setKapi(window.Kakao);
    }
  }

  return kapi;
}

export default useKapi;
