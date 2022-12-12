function assert(deuCerto) {
    if(!deuCerto) {
        throw new Error("Deveria dar True");
    }
    console.log("Ok");
}

function assertEquals(a,b) {
    if(a != b) {
        throw new Error(a+" != "+b);
    }
    console.log(a+" == "+b);
}

function test(desc, ...fn) {

    try {
        let ret = fn();
        if(ret && typeof ret.then === 'function')
        {
            ret.then(() => {
                console.log(desc,"OK");
            })
            .catch((reason) => {
                console.log("Erro no teste: ",desc);
                console.error(reason);
            })
        }
        else console.log(desc,"OK");
    } catch (error) {
        console.log("Erro no teste ",desc);
        console.error(error);
    }
}

export {assert, assertEquals, test}