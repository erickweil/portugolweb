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

export {persistentGetValue,persistentStoreValue}