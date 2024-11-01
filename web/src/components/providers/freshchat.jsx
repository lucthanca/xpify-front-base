import { createContext, useState, useCallback, useContext, useEffect, useMemo } from 'react';
function initialize(){
  window.$crisp=[];
  window.CRISP_WEBSITE_ID="5e366ec4-30b5-4074-abce-ef95ae74b337";
  (function(){ var d=document; var s=d.createElement("script"); s.src="https://client.crisp.chat/l.js"; s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
}

const FreshChatContext = createContext(undefined);

const FreshChatProvider = props => {
  const [initialized, setInitialized] = useState(false);
  const open = useCallback(() => {
    $crisp.push(['do', 'chat:open']);
  }, []);
  const close = useCallback(() => {
    $crisp.push(['do', 'chat:hide']);
  }, []);

  const api = useMemo(() => {
    return { open, close, initialized };
  }, [open, initialized, close]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      initialize();
      setInitialized(true);
    }, 3000);

    return () => {
      timeout && clearTimeout(timeout);
    }
  }, []);

  return (
    <FreshChatContext.Provider value={api}>
      {props.children}
    </FreshChatContext.Provider>
  );
}
/**
 * @returns {{ open: () => void, close: () => void }}
 */
export const useFreshChat = () => useContext(FreshChatContext);

export default FreshChatProvider;
