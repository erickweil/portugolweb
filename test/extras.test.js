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

});
