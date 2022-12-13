/* eslint-disable */

import {jest,describe,expect,test} from '@jest/globals';
import {default as nodefetch} from 'node-fetch';

//https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
import { TextEncoder, TextDecoder } from 'util';

import { readFile } from 'fs/promises';

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
            return nodefetch("http://127.0.0.1"+url,options);
            //return readFile(url,{encoding:"utf8"})
        }
        else return nodefetch(url,options);
    };
}