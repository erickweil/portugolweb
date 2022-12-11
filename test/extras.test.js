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
} from '../js/extras/extras.js'

import { assert, assertEquals, test } from '/test/test.js'

test("numberOfLinesUntil:", () => {
    assertEquals(numberOfLinesUntil(4,"aaa\nbbb\nccc"), 2);
});

test("hashCode:", () => {
    assertEquals(stringHashCode("ERICK"), stringHashCode("ER"+"ICK"));
});