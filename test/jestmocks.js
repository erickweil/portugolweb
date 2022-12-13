/* eslint-env node, jest */

import {jest,describe,expect,test} from '@jest/globals';
import {default as nodefetch} from 'node-fetch';

//https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
import { TextEncoder, TextDecoder } from 'util';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';

export function doFetchMock() {
    /*global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
    })
    );*/
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;

    global.fetch = (url,options) => {
        if(url.startsWith("/"))
        {
            //return nodefetch("file://."+url,options);

            return readFile(new URL(".."+url, import.meta.url),{encoding:"utf8"})
            .then((file) => {
                return new Promise((resolve,reject) => {
                    resolve({
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        url: url,
                        text: () => {
                            // eslint-disable-next-line
                            return new Promise((resolve,reject) => {
                                resolve(file);
                            });
                        }
                    });
                });
            });
            
        }
        else return nodefetch(url,options);
    };
}