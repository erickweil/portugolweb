//https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}


function persistentStoreValue(key,value){

if (typeof(Storage) !== "undefined" && localStorage) {
  // Code for localStorage/sessionStorage.
	// Store
	localStorage.setItem(key, value);  
} else {
  // Sorry! No Web Storage support..
}

}



function persistentGetValue(key){

if (typeof(Storage) !== "undefined" && localStorage) {
  // Code for localStorage/sessionStorage.
	return localStorage.getItem(key);
  
} else {
  // Sorry! No Web Storage support..
	return false;
}

}

// Check if a element is scrolled to top or bottom completely
function elementIsAllScrolled(obj)
{
	if( obj.scrollTop === (obj.scrollHeight - obj.offsetHeight))
	{
		return true;
	}
	if( obj.scrollTop === 0)
	{
		return true;
	}
	return false;
}

/* View in fullscreen */
function requestFullScreen(element) {
	// Supports most browsers and their versions.
	var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

	if (requestMethod) { // Native full screen.
		requestMethod.call(element);
	} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}

// To detect if device is mobile.
function isMobile() // https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
{
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

//https://stackoverflow.com/questions/596481/is-it-possible-to-simulate-key-press-events-programmatically
function simKeyDownEvent(keySelected,shift)
{
	
	/*
keydown	ANY key is pressed
keypress	ANY key except Shift, Fn, CapsLock is in pressed position. (Fired continously.)
keyup	ANY key is released
	*/

/*
KeyboardEventInitOptional
Is a KeyboardEventInit dictionary, having the following fields:
"key", optional and defaulting to "", of type DOMString, that sets the value of KeyboardEvent.key.
"code", optional and defaulting to "", of type DOMString, that sets the value of KeyboardEvent.code.
"location", optional and defaulting to 0, of type unsigned long, that sets the value of KeyboardEvent.location.
"ctrlKey", optional and defaulting to false, of type Boolean, that sets the value of KeyboardEvent.ctrlKey.
"shiftKey", optional and defaulting to false, of type Boolean, that sets the value of KeyboardEvent.shiftKey.
"altKey", optional and defaulting to false, of type Boolean, that sets the value of KeyboardEvent.altKey.
"metaKey", optional and defaulting to false, of type Boolean, that sets the value of KeyboardEvent.metaKey.
"repeat", optional and defaulting to false, of type Boolean, that sets the value of KeyboardEvent.repeat.
"isComposing", optional and defaulting to false, of type Boolean, that sets the value of KeyboardEvent.isComposing.
"charCode", optional and defaulting to 0, of type unsigned long, that sets the value of the deprecated KeyboardEvent.charCode.
"keyCode", optional and defaulting to 0, of type unsigned long, that sets the value of the deprecated KeyboardEvent.keyCode.
"which", optional and defaulting to 0, of type unsigned long, that sets the value of the deprecated KeyboardEvent.which.
*/

		var keyboardEvent = new KeyboardEvent("keydown",{"key":keySelected,"shiftKey":shift});
		//console.log("event:"+document.getElementById("myEditor").dispatchEvent(keyboardEvent));
	return keyboardEvent;
}

function simKeyUpEvent(keySelected,shift)
{
	var keyboardEvent = new KeyboardEvent("keyup",{"key":keySelected,"shiftKey":shift});
		//console.log("event:"+document.getElementById("myEditor").dispatchEvent(keyboardEvent));
	return keyboardEvent;
}

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
	return true;
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
	return true;
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
	return true;
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
	return true;
  }
  else return false;
}

/* Close fullscreen */
function closeFullscreen() {
	try{
		
		if (document.fullscreenElement || 
		document.webkitFullscreenElement || 
		document.mozFullScreenElement) {
		// can use exitFullscreen

			if (document.exitFullscreen) {
			document.exitFullscreen();
			} else if (document.mozCancelFullScreen) { /* Firefox */
			document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
			document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { /* IE/Edge */
			document.msExitFullscreen();
			}
		}
	}catch (e) {
			var myStackTrace = e.stack || e.stacktrace || "";

			console.log(myStackTrace);
		}
}

function getScreenDimensions()
{
	var width  = window.innerWidth || document.documentElement.clientWidth || 
	document.body.clientWidth;
	var height = window.innerHeight|| document.documentElement.clientHeight|| 
	document.body.clientHeight;
	
	return {width:width,height:height};
}

function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
}


function referenceSafeRemove(array,index)
{
	for(var i = index;i<array.length;i++)
	{
		if(i < (array.length -1))
		{
			array[i] = array[i+1];
		}
	}
	array.pop();
}


class TouchManager {
	constructor()
	{
		
		this.TOUCH_DELAY = 150;
		
		this.events = {};
		this.resetar();
	}
	
	resetar()
	{
		this.touches = new Array();
		this.numTouches = 0;
		this.touchDownIssued = false;
		this.touchDownDistance = 0;
	}
	
	getTouchByID(id)
	{
		for(var i=0;i<this.touches.length;i++)
		{
			if(this.touches[i].id == id) return this.touches[i];
		}
		return false;
	}
	
	addEventListener(e,func)
	{
		this.events[e] = func;
	}
	
	getFingerDistance()
	{
		if(this.touches.length == 2)
		{
			var ta = this.touches[0];
			var tb = this.touches[1];
			return Math.sqrt((ta.x - tb.x)*(ta.x - tb.x) + (ta.y - tb.y)*(ta.y - tb.y));
		}
		else return 1;
	}
	
	touchstart(e)
	{
		if(this.touches.length == 0)
		{
			this.touchDownIssued = false;
			this.numTouches=0;
			this.touchDownDistance = 0;
			this.touchDownPosition = false;
		}
		
		for(var i=0;i<e.touches.length;i++)
		{
			var new_t = e.touches[i];
			var t = this.getTouchByID(new_t.identifier);
			if(!t)
			{
				this.touches.push(
				{
					id:new_t.identifier,
					x:new_t.pageX,
					y:new_t.pageY
				}
				);
			}
			else
			{
				t.x	= new_t.pageX;
				t.y = new_t.pageY;
			}
		}
		
		if(!this.touchDownIssued)
		{
			this.numTouches= Math.max(this.numTouches,this.touches.length);
		}
		
		//this.events["onTouchDown"](this.getCenterTouchPos(),this.touches);
	}
	
	touchmove(e)
	{
		for(var i=0;i<e.changedTouches.length;i++)
		{
			var new_t = e.changedTouches[i];
			
			var t = this.getTouchByID(new_t.identifier);
			//alert(t);
			t.x	= new_t.pageX;
			t.y = new_t.pageY;
		}
		
		var touchPos = this.getCenterTouchPos();
		
		if(!this.touchDownIssued)
		{
			if(this.events["onTouchDown"])
			this.events["onTouchDown"](touchPos,this.numTouches);
			this.touchDownIssued = true;
			this.touchDownDistance = this.getFingerDistance();
		}
		else
		{
			if(this.touches.length == 2 && this.touchDownDistance > 50)
			{
				var zoomDelta = this.getFingerDistance() / this.touchDownDistance;
				if(zoomDelta)
				{
					if(this.events["onTouchZoom"])
					this.events["onTouchZoom"](touchPos,zoomDelta);
				}
				this.touchDownDistance = this.getFingerDistance();
			}
			
			if(this.numTouches <= this.touches.length)
			{
				if(this.events["onTouchMove"])
				this.events["onTouchMove"](touchPos,this.numTouches);
			}
		}
	}
	
	touchend(e)
	{
		var touchPos = this.getCenterTouchPos();
		//var touchPos = this.touchDownPosition;
		for(var i=0;i<e.changedTouches.length;i++)
		{
			var new_t = e.changedTouches[i];
			var t = this.getTouchByID(new_t.identifier);
			referenceSafeRemove(this.touches,this.touches.indexOf(t));
		}
		
		//if(this.touches.length == 0)
		//{
		if(this.numTouches > 0)
		{
			if(!this.touchDownIssued)
			{
				if(this.events["onTouchDown"])
				this.events["onTouchDown"](touchPos,this.numTouches);
				this.touchDownIssued = true;
			}
			
			if(this.events["onTouchUp"])
			this.events["onTouchUp"](touchPos,this.numTouches);
			this.numTouches=0;
		}
			
	}
	
	touchcancel(e)
	{
		this.touchend(e);
	}
	
	touchleave(e)
	{
		this.touchend(e);
	}
	
	getCenterTouchPos()
	{
		var p = {x:0,y:0};
		for(var i=0;i<this.touches.length;i++)
		{
			p.x += this.touches[i].x;
			p.y += this.touches[i].y;
		}
		
		p.x /= this.touches.length;
		p.y /= this.touches.length;
		return p;
	}
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}