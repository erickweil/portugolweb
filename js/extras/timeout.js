/** TIMEOUT 
 * Chame mySetTimeout para setar e myClearTimeout para limpar o timeout
 * */
const _extras_timeouts = {};

function mySetTimeout(name,fun,delay)
{
	//_extras_timeouts[name] = setTimeout(fun, delay);
	if(_extras_timeouts[name])
	{
		console.log("Tentando agendar novamente o timeout '"+name+"' antes de executar o anterior");
		return;
	}
	_extras_timeouts[name] = setTimeout( function() {
        _extras_timeouts[name] = false;
		fun();
	}
	,delay);
}

function myClearTimeout(name)
{
	if (_extras_timeouts[name]) {
            clearTimeout(_extras_timeouts[name]);
            _extras_timeouts[name] = false;
    }
}

export {mySetTimeout, myClearTimeout}