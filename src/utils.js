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
