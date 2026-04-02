import {
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
} from '../src/extras/extras.js';

import {jest,describe,expect,test} from '@jest/globals';

import { doFetchMock } from './jestmocks.js';
doFetchMock();



describe("extras",() => {

	test("numberOfLinesUntil:", () => {
		expect(numberOfLinesUntil(4,"aaa\nbbb\nccc")).toBe(2);
	});

	test("hashCode:", () => {
		expect(stringHashCode("ERICK")).toBe(stringHashCode("ER"+"ICK"));
	});

	test("elementIsAllScrolled tolera arredondamento no fim da rolagem", () => {
		expect(elementIsAllScrolled({
			scrollTop: 99.6,
			scrollHeight: 200,
			clientHeight: 100
		})).toBe(true);
	});

	test("referenceSafeRemove ignora índice inválido sem corromper array", () => {
		const valores = ["a","b","c"];

		expect(referenceSafeRemove(valores,-1)).toBe(false);
		expect(valores).toEqual(["a","b","c"]);
	});

	test("referenceSafeRemove remove item válido preservando ordem", () => {
		const valores = ["a","b","c"];

		expect(referenceSafeRemove(valores,1)).toBe(true);
		expect(valores).toEqual(["a","c"]);
	});

});
