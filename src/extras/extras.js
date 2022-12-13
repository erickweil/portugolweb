/**
 * FUNÇÕES ÚTEIS
 * utilizado pelo projeto de forma geral.
 */

// retorna o número de linhas, começando em 1
function numberOfLinesUntil(index,str)
{
	let st = str.substring(0,index);
	return (st.match(/\r?\n/g) || '').length + 1;
}

//https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
/**
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
function stringHashCode(s) 
{
	let h = 0;
    for(let i = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
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
	let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

	if (requestMethod) { // Native full screen.
		requestMethod.call(element);
	} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		let wscript = new window.ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
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
		let myStackTrace = e.stack || e.stacktrace || "";

			console.log(myStackTrace);
		}
}

function getScreenDimensions()
{
	let width  = window.innerWidth || document.documentElement.clientWidth || 
	document.body.clientWidth;
	let height = window.innerHeight|| document.documentElement.clientHeight|| 
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
	for(let i = index;i<array.length;i++)
	{
		if(i < (array.length -1))
		{
			array[i] = array[i+1];
		}
	}
	array.pop();
}

function httpGetAsync(theUrl, callback, options)
{
    /*var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);*/

	if(!options) options = {};

	options.method = "GET";

	return fetch(theUrl, options)
	.then((response) => {
		// check for error response
        if (!response.ok) {
            // get error message from body or default to response status
            const error = response.status;
            return Promise.reject(error);
        }

		return response.text();
	})
	.then((text) => {
		if(!text) {
			return Promise.reject("Resposta Vazia");
		}

		callback(text);
	});
}

/*function convertPromise(func)
{
	return new Promise( (resolve,reject) => {
		try {
			var ret = func()
			resolve(ret)
		} catch (error) {
			reject(error)
		}
	});
}*/

export {
	numberOfLinesUntil,
	stringHashCode,
	elementIsAllScrolled,
	requestFullScreen,
	openFullscreen,
	closeFullscreen,
	getScreenDimensions,
	addEvent,
	referenceSafeRemove,
	httpGetAsync
};