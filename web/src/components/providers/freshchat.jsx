import { createContext, memo, useCallback, useContext, useEffect, useMemo } from 'react';
function initFreshChat() {
  window.fcWidget.init({
    token: "63b4c80e-6420-42e4-ac23-0bb1c8f48f4d",
    host: "https://bsscommerce2.freshchat.com",
    widgetUuid: "75de2c86-ca7e-49c0-9166-f8d24bfa1a01",
    open: false,
  });
}
function initialize(i,t){
  console.log('RUN INIT Freshchat');
  var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0, e.src="https://bsscommerce2.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))
}
function initiateCall(){initialize(document,"Freshchat-js-sdk")}

const FreshChatContext = createContext(undefined);

const FreshChatProvider = props => {
  const open = useCallback(() => {
    if (!window.fcWidget.isOpen()) {
      window.fcWidget.open();
    }
  }, []);
  const close = useCallback(() => {
    if (window.fcWidget.isOpen()) {
      window.fcWidget.close();
    }
  }, []);

  const api = useMemo(() => {
    return { open, close };
  }, [open]);
  useEffect(() => {
    initiateCall();
  }, []);

  return (
    <FreshChatContext.Provider value={api}>
      {props.children}
    </FreshChatContext.Provider>
  );
}

export const useFreshChat = () => useContext(FreshChatContext);

export default FreshChatProvider;
