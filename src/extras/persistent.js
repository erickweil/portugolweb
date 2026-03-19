function getStorage()
{
	try {
		if (typeof(Storage) !== "undefined" && typeof localStorage !== "undefined") {
			return localStorage;
		} else {
            return undefined;
        }
	} catch (e) {
		return undefined;
	}
}

function persistentStoreValue(key,value){
    const storage = getStorage();
    if (storage) {
        // Code for localStorage/sessionStorage.
        // Store
        storage.setItem(key, value);  
    } else {
        // Sorry! No Web Storage support..
    }
}
    
function persistentGetValue(key){
	const storage = getStorage();

    if (storage) {
        // Code for localStorage/sessionStorage.
        return storage.getItem(key);
    } else {
        // Sorry! No Web Storage support..
		return null;
    }

}

export {persistentGetValue,persistentStoreValue};