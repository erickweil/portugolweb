

// https://stackoverflow.com/questions/61243646/clipboard-api-call-throws-notallowederror-without-invoking-onpermissionrequest/61546346#61546346

/**
 * A biblioteca Ace utiliza window.navigator.clipboard para determinar se há algo no clipboard
 * Porém no webview isto não funciona, Pois é preciso pedir permissões mas não é possível.
 */

export function declararClipboardPolyfill() {
if(typeof Android !== 'undefined')
{
    /* global Android */

    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard

    class MyClipboard extends EventTarget {
        read() {
            console.log("read() Clipboard");
            return Promise.resolve(
                [new ClipboardItem(
                    {
                        "text/plain":Android.getClipboardData("text/plain")
                    }
                )]
            );
        }

        readText() {
            console.log("readText() da Clipboard");
            return Promise.resolve(Android.getClipboardData("text/plain"));
        }

        write() {
            console.log("Tentou write() da Clipboard");
            return Promise.reject("Não implementado.");
        }

        writeText(newClipText) {
            console.log("writeText() da Clipboard");
            Android.setClipboardData("text/plain",newClipText);
            return Promise.resolve();
        }
    }

    if(window.navigator)
    {
        window.navigator.clipboard = new MyClipboard();
    }
}

}