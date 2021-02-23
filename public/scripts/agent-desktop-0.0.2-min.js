Uint8Array.prototype.slice||Object.defineProperty(Uint8Array.prototype,"slice",{value:function(e,t){return new Uint8Array(Array.prototype.slice.call(this,e,t))}});var CreateAgentRemoteDesktop=function(e,t){var l={};"string"==typeof(l.CanvasId=e)&&(l.CanvasId=Q(e)),l.Canvas=l.CanvasId.getContext("2d"),l.scrolldiv=t,l.State=0,l.PendingOperations=[],l.tilesReceived=0,l.TilesDrawn=0,l.KillDraw=0,l.ipad=!1,l.tabletKeyboardVisible=!1,l.LastX=0,l.LastY=0,l.touchenabled=0,l.submenuoffset=0,l.touchtimer=null,l.TouchArray={},l.connectmode=0,l.connectioncount=0,l.rotation=0,l.protocol=2,l.debugmode=0,l.firstUpKeys=[],l.stopInput=!1,l.localKeyMap=!0,l.remoteKeyMap=!1,l.pressedKeys=[],l.sessionid=0,l.username,l.oldie=!1,l.CompressionLevel=50,l.ScalingLevel=1024,l.FrameRateTimer=100,l.SwapMouse=!1,l.FirstDraw=!1,l.ScreenWidth=960,l.ScreenHeight=701,l.width=960,l.height=960,l.displays=null,l.selectedDisplay=null,l.onScreenSizeChange=null,l.onMessage=null,l.onConnectCountChanged=null,l.onDebugMessage=null,l.onTouchEnabledChanged=null,l.onDisplayinfo=null;var h=!(l.accumulator=null),g="default";l.mouseCursorActive=function(e){h!=e&&(h=e,l.CanvasId.style.cursor=1==e?g:"default")};var p=["default","progress","crosshair","pointer","help","text","no-drop","move","nesw-resize","ns-resize","nwse-resize","w-resize","alias","wait","none","not-allowed","col-resize","row-resize","copy","zoom-in","zoom-out"];l.Start=function(){l.State=0,l.accumulator=null},l.Stop=function(){l.setRotation(0),l.UnGrabKeyInput(),l.UnGrabMouseInput(),l.touchenabled=0,null!=l.onScreenSizeChange&&l.onScreenSizeChange(l,l.ScreenWidth,l.ScreenHeight,l.CanvasId),l.Canvas.clearRect(0,0,l.CanvasId.width,l.CanvasId.height)},l.xxStateChange=function(e){l.State!=e&&(l.State=e,l.CanvasId.style.cursor="default",0===e&&l.Stop())},l.send=function(e){2<l.debugmode&&console.log("KSend("+e.length+"): "+rstr2hex(e)),null!=l.parent&&l.parent.send(e)},l.ProcessPictureMsg=function(e,t,n){var o=new Image;o.xcount=l.tilesReceived++;for(var a=l.tilesReceived,r=e.slice(4),s=0,i=[];5e4<r.byteLength-s;)i.push(String.fromCharCode.apply(null,r.slice(s,s+5e4))),s+=5e4;0<s?i.push(String.fromCharCode.apply(null,r.slice(s))):i.push(String.fromCharCode.apply(null,r)),o.src="data:image/jpeg;base64,"+btoa(i.join("")),o.onload=function(){if(null!=l.Canvas&&l.KillDraw<a&&0!=l.State)for(l.PendingOperations.push([a,2,o,t,n]);l.DoPendingOperations(););else l.PendingOperations.push([a,0])},o.error=function(){console.log("DecodeTileError")}},l.DoPendingOperations=function(){if(0==l.PendingOperations.length)return!1;for(var e=0;e<l.PendingOperations.length;e++){var t=l.PendingOperations[e];if(t[0]==l.TilesDrawn+1)return 1==t[1]?l.ProcessCopyRectMsg(t[2]):2==t[1]&&(l.Canvas.drawImage(t[2],l.rotX(t[3],t[4]),l.rotY(t[3],t[4])),delete t[2]),l.PendingOperations.splice(e,1),delete t,l.TilesDrawn++,l.TilesDrawn==l.tilesReceived&&l.KillDraw<l.TilesDrawn&&(l.KillDraw=l.TilesDrawn=l.tilesReceived=0),!0}return l.oldie&&0<l.PendingOperations.length&&l.TilesDrawn++,!1},l.ProcessCopyRectMsg=function(e){var t=((255&e.charCodeAt(0))<<8)+(255&e.charCodeAt(1)),n=((255&e.charCodeAt(2))<<8)+(255&e.charCodeAt(3)),o=((255&e.charCodeAt(4))<<8)+(255&e.charCodeAt(5)),a=((255&e.charCodeAt(6))<<8)+(255&e.charCodeAt(7)),r=((255&e.charCodeAt(8))<<8)+(255&e.charCodeAt(9)),e=((255&e.charCodeAt(10))<<8)+(255&e.charCodeAt(11));l.Canvas.drawImage(Canvas.canvas,t,n,r,e,o,a,r,e)},l.SendUnPause=function(){1<l.debugmode&&console.log("SendUnPause"),l.send(String.fromCharCode(0,8,0,5,0))},l.SendPause=function(){1<l.debugmode&&console.log("SendPause"),l.send(String.fromCharCode(0,8,0,5,1))},l.SendCompressionLevel=function(e,t,n,o){t&&(l.CompressionLevel=t),n&&(l.ScalingLevel=n),o&&(l.FrameRateTimer=o),l.send(String.fromCharCode(0,5,0,10,e,l.CompressionLevel)+l.shortToStr(l.ScalingLevel)+l.shortToStr(l.FrameRateTimer))},l.SendRefresh=function(){l.send(String.fromCharCode(0,6,0,4))},l.ProcessScreenMsg=function(e,t){if(0<l.debugmode&&console.log("ScreenSize: "+e+" x "+t),l.ScreenWidth!=e||l.ScreenHeight!=t){for(l.Canvas.setTransform(1,0,0,1,0,0),l.rotation=0,l.FirstDraw=!0,l.ScreenWidth=l.width=e,l.ScreenHeight=l.height=t,l.KillDraw=l.tilesReceived;0<l.PendingOperations.length;)l.PendingOperations.shift();l.SendCompressionLevel(1),l.SendUnPause(),null!=l.onScreenSizeChange&&l.onScreenSizeChange(l,l.ScreenWidth,l.ScreenHeight,l.CanvasId)}},l.ProcessBinaryCommand=function(e,t,n){var o,a;switch(3!=e&&4!=e&&7!=e||(o=(n[4]<<8)+n[5],a=(n[6]<<8)+n[7]),2<l.debugmode&&console.log("CMD",e,t,o,a),null!=l.recordedData&&(65e3<t?l.recordedData.push(S(2,1,l.shortToStr(27)+l.shortToStr(8)+l.intToStr(t)+l.shortToStr(e)+l.shortToStr(0)+l.shortToStr(0)+l.shortToStr(0)+String.fromCharCode.apply(null,n))):l.recordedData.push(S(2,1,String.fromCharCode.apply(null,n)))),e){case 3:l.FirstDraw&&l.onResize(),l.ProcessPictureMsg(n.slice(4),o,a);break;case 7:l.ProcessScreenMsg(o,a),l.SendKeyMsgKC(l.KeyAction.UP,16),l.SendKeyMsgKC(l.KeyAction.UP,17),l.SendKeyMsgKC(l.KeyAction.UP,18),l.SendKeyMsgKC(l.KeyAction.UP,91),l.SendKeyMsgKC(l.KeyAction.UP,92),l.SendKeyMsgKC(l.KeyAction.UP,16),l.send(String.fromCharCode(0,14,0,4));break;case 11:var r=0,s={},i=(n[4]<<8)+n[5];if(0<i)for(var r=(n[6+2*i]<<8)+n[7+2*i],c=0;c<i;c++){var u=(n[6+2*c]<<8)+n[7+2*c];s[u]=65535==u?"All Displays":"Display "+u}l.displays=s,l.selectedDisplay=r,null!=l.onDisplayinfo&&l.onDisplayinfo(l,s,r);break;case 12:break;case 14:l.touchenabled=1,l.TouchArray={},null!=l.onTouchEnabledChanged&&l.onTouchEnabledChanged(l.touchenabled);break;case 15:l.TouchArray={};break;case 17:var d=String.fromCharCode.apply(null,data.slice(4));console.log("Got KVM Message: "+d),null!=l.onMessage&&l.onMessage(d,l);break;case 65:"."!=(d=String.fromCharCode.apply(null,data.slice(4)))[0]?(console.log(d),l.parent&&l.parent.setConsoleMessage&&l.parent.setConsoleMessage(d)):console.log("KVM: "+d.substring(1));break;case 88:if(5!=t||l.stopInput)break;d=n[4];g=p[d=p.length<d?0:d],h&&(l.CanvasId.style.cursor=g);break;default:console.log("Unknown command",e,t)}},l.MouseButton={NONE:0,LEFT:2,RIGHT:8,MIDDLE:32},l.KeyAction={NONE:0,DOWN:1,UP:2,SCROLL:3,EXUP:4,EXDOWN:5,DBLCLICK:6},l.InputType={KEY:1,MOUSE:2,CTRLALTDEL:10,TOUCH:15,KEYUNICODE:85},l.Alternate=0;var o={Pause:19,CapsLock:20,Space:32,Quote:222,Minus:189,NumpadMultiply:106,NumpadAdd:107,PrintScreen:44,Comma:188,NumpadSubtract:109,NumpadDecimal:110,Period:190,Slash:191,NumpadDivide:111,Semicolon:186,Equal:187,OSLeft:91,BracketLeft:219,OSRight:91,Backslash:220,BracketRight:221,ContextMenu:93,Backquote:192,NumLock:144,ScrollLock:145,Backspace:8,Tab:9,Enter:13,NumpadEnter:13,Escape:27,Delete:46,Home:36,PageUp:33,PageDown:34,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,End:35,Insert:45,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,ShiftLeft:16,ShiftRight:16,ControlLeft:17,ControlRight:17,AltLeft:18,AltRight:18,MetaLeft:91,MetaRight:92,VolumeMute:181};function S(e,t,n){var o=Date.now();return"number"==typeof n?(l.recordedSize+=n,l.shortToStr(e)+l.shortToStr(t)+l.intToStr(n)+l.intToStr(o>>32)+l.intToStr(32&o)):(l.recordedSize+=n.length,l.shortToStr(e)+l.shortToStr(t)+l.intToStr(n.length)+l.intToStr(o>>32)+l.intToStr(32&o)+n)}return l.SendKeyMsg=function(e,t){var n;null!=e&&((t=t||window.event).code&&0==l.localKeyMap?null!=(n=(n=t).code.startsWith("Key")&&4==n.code.length?n.code.charCodeAt(3):n.code.startsWith("Digit")&&6==n.code.length?n.code.charCodeAt(5):n.code.startsWith("Numpad")&&7==n.code.length?n.code.charCodeAt(6)+48:o[n.code])&&l.SendKeyMsgKC(e,n):(59==(n=t.keyCode)?n=186:173==n?n=189:61==n&&(n=187),l.SendKeyMsgKC(e,n)))},l.SendMessage=function(e){3==l.State&&l.send(String.fromCharCode(0,17)+l.shortToStr(4+e.length)+e)},l.SendKeyMsgKC=function(e,t){if(3==l.State)if("object"==typeof e)for(var n in e)l.SendKeyMsgKC(e[n][0],e[n][1]);else 1==e?-1==l.pressedKeys.indexOf(t)&&l.pressedKeys.unshift(t):2==e&&-1!=(n=l.pressedKeys.indexOf(t))&&l.pressedKeys.splice(n,1),0<l.debugmode&&console.log("Sending Key "+t+", action "+e),l.send(String.fromCharCode(0,l.InputType.KEY,0,6,e-1,t))},l.SendStringUnicode=function(e){if(3==l.State)for(var t=0;t<e.length;t++)l.send(String.fromCharCode(0,l.InputType.KEYUNICODE,0,7,0)+ShortToStr(e.charCodeAt(t)))},l.SendKeyUnicode=function(e,t){3==l.State&&(0<l.debugmode&&console.log("Sending UnicodeKey "+t),l.send(String.fromCharCode(0,l.InputType.KEYUNICODE,0,7,e-1)+ShortToStr(t)))},l.sendcad=function(){l.SendCtrlAltDelMsg()},l.SendCtrlAltDelMsg=function(){3==l.State&&l.send(String.fromCharCode(0,l.InputType.CTRLALTDEL,0,4))},l.SendEscKey=function(){3==l.State&&l.send(String.fromCharCode(0,l.InputType.KEY,0,6,0,27,0,l.InputType.KEY,0,6,1,27))},l.SendStartMsg=function(){l.SendKeyMsgKC(l.KeyAction.EXDOWN,91),l.SendKeyMsgKC(l.KeyAction.EXUP,91)},l.SendCharmsMsg=function(){l.SendKeyMsgKC(l.KeyAction.EXDOWN,91),l.SendKeyMsgKC(l.KeyAction.DOWN,67),l.SendKeyMsgKC(l.KeyAction.UP,67),l.SendKeyMsgKC(l.KeyAction.EXUP,91)},l.SendTouchMsg1=function(e,t,n,o){3==l.State&&l.send(String.fromCharCode(0,l.InputType.TOUCH)+l.shortToStr(14)+String.fromCharCode(1,e)+l.intToStr(t)+l.shortToStr(n)+l.shortToStr(o))},l.SendTouchMsg2=function(e,t){var n,o,a="";for(o in l.TouchArray)o==e?n=t:1==l.TouchArray[o].f?(n=65542,l.TouchArray[o].f=3,0):2==l.TouchArray[o].f?(n=262144,0):n=131078,a+=String.fromCharCode(o)+l.intToStr(n)+l.shortToStr(l.TouchArray[o].x)+l.shortToStr(l.TouchArray[o].y),2==l.TouchArray[o].f&&delete l.TouchArray[o];3==l.State&&l.send(String.fromCharCode(0,l.InputType.TOUCH)+l.shortToStr(5+a.length)+String.fromCharCode(2)+a),0==Object.keys(l.TouchArray).length&&null!=l.touchtimer&&(clearInterval(l.touchtimer),l.touchtimer=null)},l.SendMouseMsg=function(e,t){var n,o,a,r,s,i;3==l.State&&null!=e&&null!=l.Canvas&&(t=t||window.event,s=l.Canvas.canvas.height/l.CanvasId.clientHeight,r=l.Canvas.canvas.width/l.CanvasId.clientWidth,i=l.GetPositionOfControl(l.Canvas.canvas),n=(t.pageX-i[0])*r,o=(t.pageY-i[1])*s,t.addx&&(n+=t.addx),t.addy&&(o+=t.addy),0<=n&&n<=l.Canvas.canvas.width&&0<=o&&o<=l.Canvas.canvas.height&&(r=a=0,e==l.KeyAction.UP||e==l.KeyAction.DOWN?t.which?a=1==t.which?l.MouseButton.LEFT:2==t.which?l.MouseButton.MIDDLE:l.MouseButton.RIGHT:t.button&&(a=0==t.button?l.MouseButton.LEFT:1==t.button?l.MouseButton.MIDDLE:l.MouseButton.RIGHT):e==l.KeyAction.SCROLL&&(t.detail?r=120*t.detail*-1:t.wheelDelta&&(r=3*t.wheelDelta)),!0===l.SwapMouse&&(a==l.MouseButton.LEFT?a=l.MouseButton.RIGHT:a==l.MouseButton.RIGHT&&(a=l.MouseButton.LEFT)),i="",i=e==l.KeyAction.DBLCLICK?String.fromCharCode(0,l.InputType.MOUSE,0,10,0,136,n/256&255,255&n,o/256&255,255&o):e==l.KeyAction.SCROLL?(t=r<(t=s=0)?(s=255-(Math.abs(r)>>8),255-(255&Math.abs(r))):(s=r>>8,255&r),String.fromCharCode(0,l.InputType.MOUSE,0,12,0,0,n/256&255,255&n,o/256&255,255&o,s,t)):String.fromCharCode(0,l.InputType.MOUSE,0,10,0,e==l.KeyAction.DOWN?a:2*a&255,n/256&255,255&n,o/256&255,255&o),l.Action==l.KeyAction.NONE?0==l.Alternate||l.ipad?(l.send(i),l.Alternate=1):l.Alternate=0:l.send(i)))},l.GetDisplayNumbers=function(){l.send(String.fromCharCode(0,11,0,4))},l.SetDisplay=function(e){l.send(String.fromCharCode(0,12,0,6,e>>8,255&e))},l.intToStr=function(e){return String.fromCharCode(e>>24&255,e>>16&255,e>>8&255,255&e)},l.shortToStr=function(e){return String.fromCharCode(e>>8&255,255&e)},l.onResize=function(){0!=l.ScreenWidth&&0!=l.ScreenHeight&&(l.Canvas.canvas.width==l.ScreenWidth&&l.Canvas.canvas.height==l.ScreenHeight||(l.FirstDraw&&(l.Canvas.canvas.width=l.ScreenWidth,l.Canvas.canvas.height=l.ScreenHeight,l.Canvas.fillRect(0,0,l.ScreenWidth,l.ScreenHeight),null!=l.onScreenSizeChange&&l.onScreenSizeChange(l,l.ScreenWidth,l.ScreenHeight,l.CanvasId)),l.FirstDraw=!1,1<l.debugmode&&console.log("onResize: "+l.ScreenWidth+" x "+l.ScreenHeight)))},l.xxMouseInputGrab=!1,l.xxKeyInputGrab=!1,l.xxMouseMove=function(e){return 3==l.State&&l.SendMouseMsg(l.KeyAction.NONE,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},l.xxMouseUp=function(e){return 3==l.State&&l.SendMouseMsg(l.KeyAction.UP,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},l.xxMouseDown=function(e){return 3==l.State&&l.SendMouseMsg(l.KeyAction.DOWN,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},l.xxMouseDblClick=function(e){return 3==l.State&&l.SendMouseMsg(l.KeyAction.DBLCLICK,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},l.xxDOMMouseScroll=function(e){return 3!=l.State||(l.SendMouseMsg(l.KeyAction.SCROLL,e),!1)},l.xxMouseWheel=function(e){return 3!=l.State||(l.SendMouseMsg(l.KeyAction.SCROLL,e),!1)},l.xxKeyUp=function(e){return"Dead"!=e.key&&3==l.State&&("string"==typeof e.key&&1==e.key.length&&1!=e.ctrlKey&&1!=e.altKey&&(0==l.remoteKeyMap||0<l.debugmode)?l.SendKeyUnicode(l.KeyAction.UP,e.key.charCodeAt(0)):l.SendKeyMsg(l.KeyAction.UP,e)),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},l.xxKeyDown=function(e){if("Dead"!=e.key&&3==l.State&&("string"!=typeof e.key||1!=e.key.length||1==e.ctrlKey||1==e.altKey||!(0==l.remoteKeyMap||0<l.debugmode)))return l.SendKeyMsg(l.KeyAction.DOWN,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},l.xxKeyPress=function(e){return"Dead"!=e.key&&3==l.State&&"string"==typeof e.key&&1==e.key.length&&1!=e.ctrlKey&&1!=e.altKey&&(0==l.remoteKeyMap||0<l.debugmode)&&l.SendKeyUnicode(l.KeyAction.DOWN,e.key.charCodeAt(0)),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},l.handleKeys=function(e){return 1!=l.stopInput&&3==desktop.State&&l.xxKeyPress(e)},l.handleKeyUp=function(e){return 1!=l.stopInput&&3==desktop.State&&(l.firstUpKeys.length<5&&(l.firstUpKeys.push(e.keyCode),5==l.firstUpKeys.length&&("16,17,91,91,16"!=(t=l.firstUpKeys.join(","))&&"16,17,18,91,92"!=t||(l.stopInput=!0))),l.xxKeyUp(e));var t},l.handleKeyDown=function(e){return 1!=l.stopInput&&3==desktop.State&&l.xxKeyDown(e)},l.handleReleaseKeys=function(){var e,t=JSON.parse(JSON.stringify(l.pressedKeys));for(e in t)l.SendKeyMsgKC(l.KeyAction.UP,t[e])},l.mousedblclick=function(e){return 1!=l.stopInput&&l.xxMouseDblClick(e)},l.mousedown=function(e){return 1!=l.stopInput&&l.xxMouseDown(e)},l.mouseup=function(e){return 1!=l.stopInput&&l.xxMouseUp(e)},l.mousemove=function(e){return 1!=l.stopInput&&l.xxMouseMove(e)},l.mousewheel=function(e){return 1!=l.stopInput&&l.xxMouseWheel(e)},l.xxMsTouchEvent=function(e){var t,n,o,a;if(4!=e.originalEvent.pointerType)return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),"MSPointerDown"==e.type||"MSPointerMove"==e.type||"MSPointerUp"==e.type?(t=0,n=e.originalEvent.pointerId%256,o=e.offsetX*(Canvas.canvas.width/l.CanvasId.clientWidth),a=e.offsetY*(Canvas.canvas.height/l.CanvasId.clientHeight),"MSPointerDown"==e.type?t=65542:"MSPointerMove"==e.type?t=131078:"MSPointerUp"==e.type&&(t=262144),l.TouchArray[n]||(l.TouchArray[n]={x:o,y:a}),l.SendTouchMsg2(n,t),"MSPointerUp"==e.type&&delete l.TouchArray[n]):alert(e.type),!0},l.xxTouchStart=function(e){if(3==l.State)if(e.preventDefault&&e.preventDefault(),0==l.touchenabled||1==l.touchenabled){var t;1<e.originalEvent.touches.length||(t=e.originalEvent.touches[0],e.which=1,l.LastX=e.pageX=t.pageX,l.LastY=e.pageY=t.pageY,l.SendMouseMsg(KeyAction.DOWN,e))}else{var n,o,a=l.GetPositionOfControl(Canvas.canvas);for(n in e.originalEvent.changedTouches)e.originalEvent.changedTouches[n].identifier&&(o=e.originalEvent.changedTouches[n].identifier%256,l.TouchArray[o]||(l.TouchArray[o]={x:(e.originalEvent.touches[n].pageX-a[0])*(Canvas.canvas.width/l.CanvasId.clientWidth),y:(e.originalEvent.touches[n].pageY-a[1])*(Canvas.canvas.height/l.CanvasId.clientHeight),f:1}));0<Object.keys(l.TouchArray).length&&null==touchtimer&&(l.touchtimer=setInterval(function(){l.SendTouchMsg2(256,0)},50))}},l.xxTouchMove=function(e){if(3==l.State)if(e.preventDefault&&e.preventDefault(),0==l.touchenabled||1==l.touchenabled){var t;1<e.originalEvent.touches.length||(t=e.originalEvent.touches[0],e.which=1,l.LastX=e.pageX=t.pageX,l.LastY=e.pageY=t.pageY,l.SendMouseMsg(l.KeyAction.NONE,e))}else{var n,o,a=l.GetPositionOfControl(Canvas.canvas);for(n in e.originalEvent.changedTouches)e.originalEvent.changedTouches[n].identifier&&(o=e.originalEvent.changedTouches[n].identifier%256,l.TouchArray[o]&&(l.TouchArray[o].x=(e.originalEvent.touches[n].pageX-a[0])*(l.Canvas.canvas.width/l.CanvasId.clientWidth),l.TouchArray[o].y=(e.originalEvent.touches[n].pageY-a[1])*(l.Canvas.canvas.height/l.CanvasId.clientHeight)))}},l.xxTouchEnd=function(e){if(3==l.State)if(e.preventDefault&&e.preventDefault(),0==l.touchenabled||1==l.touchenabled)1<e.originalEvent.touches.length||(e.which=1,e.pageX=LastX,e.pageY=LastY,l.SendMouseMsg(KeyAction.UP,e));else for(var t in e.originalEvent.changedTouches)e.originalEvent.changedTouches[t].identifier&&(t=e.originalEvent.changedTouches[t].identifier%256,l.TouchArray[t]&&(l.TouchArray[t].f=2))},l.GrabMouseInput=function(){var e;1!=l.xxMouseInputGrab&&((e=l.CanvasId).onmousemove=l.xxMouseMove,e.onmouseup=l.xxMouseUp,e.onmousedown=l.xxMouseDown,e.touchstart=l.xxTouchStart,e.touchmove=l.xxTouchMove,e.touchend=l.xxTouchEnd,e.MSPointerDown=l.xxMsTouchEvent,e.MSPointerMove=l.xxMsTouchEvent,e.MSPointerUp=l.xxMsTouchEvent,navigator.userAgent.match(/mozilla/i)?e.DOMMouseScroll=l.xxDOMMouseScroll:e.onmousewheel=l.xxMouseWheel,l.xxMouseInputGrab=!0)},l.UnGrabMouseInput=function(){var e;0!=l.xxMouseInputGrab&&((e=l.CanvasId).onmousemove=null,e.onmouseup=null,e.onmousedown=null,e.touchstart=null,e.touchmove=null,e.touchend=null,e.MSPointerDown=null,e.MSPointerMove=null,e.MSPointerUp=null,navigator.userAgent.match(/mozilla/i)?e.DOMMouseScroll=null:e.onmousewheel=null,l.xxMouseInputGrab=!1)},l.GrabKeyInput=function(){1!=l.xxKeyInputGrab&&(document.onkeyup=l.xxKeyUp,document.onkeydown=l.xxKeyDown,document.onkeypress=l.xxKeyPress,l.xxKeyInputGrab=!0)},l.UnGrabKeyInput=function(){0!=l.xxKeyInputGrab&&(document.onkeyup=null,document.onkeydown=null,document.onkeypress=null,l.xxKeyInputGrab=!1)},l.GetPositionOfControl=function(e){var t=Array(2);for(t[0]=t[1]=0;e;)t[0]+=e.offsetLeft,t[1]+=e.offsetTop,e=e.offsetParent;return t},l.crotX=function(e,t){return 0==l.rotation?e:1==l.rotation?t:2==l.rotation?l.Canvas.canvas.width-e:3==l.rotation?l.Canvas.canvas.height-t:void 0},l.crotY=function(e,t){return 0==l.rotation?t:1==l.rotation?l.Canvas.canvas.width-e:2==l.rotation?l.Canvas.canvas.height-t:3==l.rotation?e:void 0},l.rotX=function(e,t){return 0==l.rotation||1==l.rotation?e:2==l.rotation?e-l.Canvas.canvas.width:3==l.rotation?e-l.Canvas.canvas.height:void 0},l.rotY=function(e,t){return 0==l.rotation||3==l.rotation?t:1==l.rotation?t-l.Canvas.canvas.width:2==l.rotation?t-l.Canvas.canvas.height:void 0},l.tcanvas=null,l.setRotation=function(e){for(;e<0;)e+=4;var t=e%4;if(t==l.rotation)return!0;var n=l.Canvas.canvas.width,o=l.Canvas.canvas.height;1!=l.rotation&&3!=l.rotation||(n=l.Canvas.canvas.height,o=l.Canvas.canvas.width),null==l.tcanvas&&(l.tcanvas=document.createElement("canvas"));var a=l.tcanvas.getContext("2d");return a.setTransform(1,0,0,1,0,0),a.canvas.width=n,a.canvas.height=o,a.rotate(-90*l.rotation*Math.PI/180),0==l.rotation&&a.drawImage(l.Canvas.canvas,0,0),1==l.rotation&&a.drawImage(l.Canvas.canvas,-l.Canvas.canvas.width,0),2==l.rotation&&a.drawImage(l.Canvas.canvas,-l.Canvas.canvas.width,-l.Canvas.canvas.height),3==l.rotation&&a.drawImage(l.Canvas.canvas,0,-l.Canvas.canvas.height),0!=l.rotation&&2!=l.rotation||(l.Canvas.canvas.height=n,l.Canvas.canvas.width=o),1!=l.rotation&&3!=l.rotation||(l.Canvas.canvas.height=o,l.Canvas.canvas.width=n),l.Canvas.setTransform(1,0,0,1,0,0),l.Canvas.rotate(90*t*Math.PI/180),l.rotation=t,l.Canvas.drawImage(l.tcanvas,l.rotX(0,0),l.rotY(0,0)),l.ScreenWidth=l.Canvas.canvas.width,l.ScreenHeight=l.Canvas.canvas.height,null!=l.onScreenSizeChange&&l.onScreenSizeChange(l,l.ScreenWidth,l.ScreenHeight,l.CanvasId),!0},l.StartRecording=function(){null==l.recordedData&&l.CanvasId.toBlob(function(e){var s=new FileReader;s.readAsArrayBuffer(e),s.onload=function(e){for(var t="",n=new Uint8Array(s.result),o=n.byteLength,a=0;a<o;a++)t+=String.fromCharCode(n[a]);l.recordedData=[],l.recordedStart=Date.now(),l.recordedSize=0,l.recordedData.push(S(1,0,JSON.stringify({magic:"MeshCentralRelaySession",ver:1,time:(new Date).toLocaleString(),protocol:2}))),l.recordedData.push(S(2,1,l.shortToStr(7)+l.shortToStr(8)+l.shortToStr(l.ScreenWidth)+l.shortToStr(l.ScreenHeight)));var r=8+t.length;65e3<r?l.recordedData.push(S(2,1,l.shortToStr(27)+l.shortToStr(8)+l.intToStr(r)+l.shortToStr(3)+l.shortToStr(0)+l.shortToStr(0)+l.shortToStr(0)+t)):l.recordedData.push(S(2,1,l.shortToStr(3)+l.shortToStr(r)+l.shortToStr(0)+l.shortToStr(0)+t))}})},l.StopRecording=function(){if(null!=l.recordedData){var e=l.recordedData;return e.push(S(3,0,"MeshCentralMCREC")),delete l.recordedData,delete l.recordedStart,delete l.recordedSize,e}},l.MuchTheSame=function(e,t){return Math.abs(e-t)<4},l.Debug=function(e){console.log(e)},l.getIEVersion=function(){var e,t=-1;return"Microsoft Internet Explorer"==navigator.appName&&(e=navigator.userAgent,null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(e)&&(t=parseFloat(RegExp.$1))),t},l.haltEvent=function(e){return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},l}