
/**
APIs
**/
function getBridgeVersion() {
    return ADBRIX_BRIDGE_VERSION;
};
function sendOnLoadFailed(){
  if(isAndroidBridgeAvailable()){
    window.adbrixBridge.onLoadFailed();
  }
  if(isIosBridgeAvailable()){
    window.webkit.messageHandlers.adbrixBridge.onLoadFailed.postMessage();
  }
}
function sendOnLoadFinished(){
  if(isAndroidBridgeAvailable()){
    window.adbrixBridge.onLoadFinished();
  }
  if(isIosBridgeAvailable()){
    window.webkit.messageHandlers.adbrixBridge.onLoadFinished.postMessage();
  }
}
function sendOnDomContentLoaded(){
  if(isAndroidBridgeAvailable()){
    window.adbrixBridge.onDomContentLoaded();
  }
  if(isIosBridgeAvailable()){
    window.webkit.messageHandlers.adbrixBridge.onDomContentLoaded.postMessage();
  }
}
// function personalizeView(json){
//   if(!isEmpty(json)){
//     console.log("personalizeView: json is empty");
//     return ;
//   }
//   const obj = JSON.parse(json);
//   var title = obj.title
//   var body = obj.body
//   var portrait = obj.portrait
//   var landscape = obj.landscape
//   if(!isEmpty(title)){
//     document.getElementById("title").textContent=title;
//   }
//   if(!isEmpty(body)){
//     document.getElementById("body").textContent=body;
//   }
//   if(!isEmpty(portrait)){
//     document.getElementById("portrait").src=portrait;
//   }
//   if(!isEmpty(landscape)){
//     document.getElementById("landscape").src=landscape;
//   }
//   sendOnPersonalizeFinished();
// }
// function sendOnPersonalizeFinished(){
//   if(isAndroidBridgeAvailable()){
//     window.adbrixBridge.onPersonalizeFinished();
//   }
//   if(isIosBridgeAvailable()){
//     window.webkit.messageHandlers.adbrixBridge.onPersonalizeFinished.postMessage();
//   }
// }

function sendOnClickEvent(actionType, actionId, actionArg){
  if(isAndroidBridgeAvailable()){
    sendOnClickEventToAndroid(actionType, actionId, actionArg);
  }
  if(isIosBridgeAvailable()){
    sendOnClickEventToIos(actionType, actionId, actionArg);
  }
}
function sendOnClickEventToAndroid(actionType, actionId, actionArg){
  window.adbrixBridge.onClick(getActionData(actionType, actionId, actionArg));
}
function sendOnClickEventToIos(actionType, actionId, actionArg){
  window.webkit.messageHandlers.adbrixBridge.onClick.postMessage(getActionData(actionType, actionId, actionArg));
}
/**
System events
**/
//브라우저가 HTML을 전부 읽고 DOM 트리를 완성하는 즉시 발생합니다. 이미지 파일(<img>)이나 스타일시트 등의 기타 자원은 기다리지 않습니다.
document.addEventListener("DOMContentLoaded", event => {
    sendOnDomContentLoaded();
});

//HTML로 DOM 트리를 만드는 게 완성되었을 뿐만 아니라 이미지, 스타일시트 같은 외부 자원도 모두 불러오는 것이 끝났을 때 발생합니다.
window.addEventListener("load", event => {
    //이미지가 다 다운로드 되었는지 체크
    var isAllImageDownloaded = true;
    document.querySelectorAll('[data-dfn-image]').forEach((img) => {
      var isImageLoaded = image.complete && image.naturalHeight !== 0;
      isAllImageDownloaded = isAllImageDownloaded && isImageLoaded;
    });
    if(isAllImageDownloaded){
      sendOnLoadFinished();
    } else{
      sendOnLoadFailed();
    }
});
//버튼 이벤트 등록
document.querySelectorAll('[data-action-id]').forEach((button) => {
  button.addEventListener('click', function(event) {
    console.log(`id: ${button.dataset.actionId}, type: ${button.dataset.actionType}, arguments: ${button.dataset.actionArg}`);
    var actionType = getActionType(button.dataset.actionType);
    sendOnClickEvent(actionType, button.dataset.actionId, button.dataset.actionArg);
  })
});

/**
Constants
**/
export default {
  ADBRIX_BRIDGE_VERSION: '1.0.0',
  ADBRIX_BRIDGE_NATIVE_JAVASCRIPT_BRIDGE: 'adbridBridge'
};
const ActionType{
  CLOSE: 'c',
  WEBLINK: 'w',
  DEEPLINK_AND_CLOSE: 'd',
  WEBLINK_AND_CLOSE: 'wc',
  DONT_SHOW_ME_TODAY_AND_CLOSE: 'ds'
}
/**
Utils
**/
function getActionData(action_type, action_id, action_arg){
   var data = new Object();
   data.action_type = action_type;
   data.action_id = action_id;
   data.action_arg = action_arg;
   var jsonData = JSON.stringify(data);
   return jsonData;
}
function getActionType(data){
  if(data == ActionType.CLOSE) return "close";
  else if(data == ActionType.DEEPLINK_AND_CLOSE) return "deeplink_and_close";
  else if(data == ActionType.WEBLINK) return "weblink";
  else if(data == ActionType.WEBLINK_AND_CLOSE) return "weblink_and_close";
  else if(data == ActionType.DONT_SHOW_ME_TODAY_AND_CLOSE) return "dont_show_me_today_and_close";
  else return return "close";
}
function isEmpty(str) {
  return (!str || str.length === 0 );
}
function isAndroidBridgeAvailable(){
  var result = false;
  if(window.adbrixBridge){
    result = true;
  }
  if(!result){
    console.log("No Android APIs found.");
  }
  return result;
}
function isIosBridgeAvailable(){
  var result = false;
  if(window.webkit
    && window.webkit.messageHandlers
    && window.webkit.messageHandlers.adbrixBridge){
    result = true;
  }
  if(!result){
    console.log("No iOS APIs found.");
  }
  return result;
}
