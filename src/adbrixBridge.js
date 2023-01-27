import Constants from './constants';
import Utils from './utils';

function getBridgeVersion() {
    return VERSION;
};
function sendOnLoadFailed(){
  if(Utils.isAndroidBridgeAvailable()){
    window.adbrixBridge.onLoadFailed();
  }
  if(Utils.isIosBridgeAvailable()){
    window.webkit.messageHandlers.adbrixBridge.onLoadFailed.postMessage();
  }
}
function sendOnLoadFinished(){
  if(Utils.isAndroidBridgeAvailable()){
    window.adbrixBridge.onLoadFinished();
  }
  if(Utils.isIosBridgeAvailable()){
    window.webkit.messageHandlers.adbrixBridge.onLoadFinished.postMessage();
  }
}
function personalizeView(json){
  if(!Utils.isEmpty(json)){
    console.log("personalizeView: json is empty");
    return ;
  }
  const obj = JSON.parse(json);
  var title = obj.title
  var body = obj.body
  var portrait = obj.portrait
  var landscape = obj.landscape
  if(!Utils.isEmpty(title)){
    document.getElementById("title").textContent=title;
  }
  if(!Utils.isEmpty(body)){
    document.getElementById("body").textContent=body;
  }
  if(!Utils.isEmpty(portrait)){
    document.getElementById("portrait").src=portrait;
  }
  if(!Utils.isEmpty(landscape)){
    document.getElementById("landscape").src=landscape;
  }
  sendOnPersonalizeFinished();
}
function sendOnPersonalizeFinished(){
  if(Utils.isAndroidBridgeAvailable()){
    window.adbrixBridge.onPersonalizeFinished();
  }
  if(Utils.isIosBridgeAvailable()){
    window.webkit.messageHandlers.adbrixBridge.onPersonalizeFinished.postMessage();
  }
}

function sendClickEvent(actionType, actionId, actionArg){
  if(Utils.isAndroidBridgeAvailable()){
    sendClickEventToAndroid(actionType, actionId, actionArg);
  }
  if(Utils.isIosBridgeAvailable()){
    sendClickEventToIos(actionType, actionId, actionArg);
  }
}
function sendClickEventToAndroid(actionType, actionId, actionArg){
  switch(actionType){
    case Constants.ActionType.CLOSE:{
      window.adbrixBridge.close(getActionData(actionId, actionArg));
      break;
    }
    case Constants.ActionType.DEEPLINK_AND_CLOSE:{
      window.adbrixBridge.deeplink_and_close(getActionData(actionId, actionArg));
      break;
    }
    case Constants.ActionType.WEBLINK:{
      window.adbrixBridge.weblink(getActionData(actionId, actionArg));
      break;
    }
    case Constants.ActionType.WEBLINKT_AND_CLOSE:{
      window.adbrixBridge.weblink_and_close(getActionData(actionId, actionArg));
      break;
    }
    case Constants.ActionType.DONT_SHOW_ME_TODAY_AND_CLOSE:{
      window.adbrixBridge.dont_show_me_today_and_close(getActionData(actionId, actionArg));
      break;
    }
  }
}
function sendClickEventToIos(actionType, actionId, actionArg){
  switch(actionType){
    case Constants.ActionType.CLOSE:{
      window.webkit.messageHandlers.adbrixBridge.close.postMessage(actionData);
      break;
    }
    case Constants.ActionType.DEEPLINK_AND_CLOSE:{
      window.webkit.messageHandlers.adbrixBridge.deeplink_and_close.postMessage(actionData);
      break;
    }
    case Constants.ActionType.WEBLINK:{
      window.webkit.messageHandlers.adbrixBridge.weblink.postMessage(actionData);
      break;
    }
    case Constants.ActionType.WEBLINKT_AND_CLOSE:{
      window.webkit.messageHandlers.adbrixBridge.weblink_and_close.postMessage(actionData);
      break;
    }
    case Constants.ActionType.DONT_SHOW_ME_TODAY_AND_CLOSE:{
      window.webkit.messageHandlers.adbrixBridge.dont_show_me_today_and_close.postMessage(actionData);
      break;
    }
  }
}
function getActionData(action_id, action_arg){
   var data = new Object();
   data.action_id = action_id;
   data.action_arg = action_arg;
   var jsonData = JSON.stringify(data);
   return jsonData;
}
