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

function test(desc, fn) {
    try {
        console.log(desc);
        fn();
    } catch (error) {
        console.log('\n');
        console.error(desc,error);
    }
}

export {assert, assertEquals, test}