import {runTests as test_extras} from "./extras.test.js";
import {runTests as test_tokenizer} from "./tokenizer.test.js";
import {runTests as test_parser} from "./parser.test.js";
import {runTests as test_vmcompiler} from "./vmcompiler.test.js";
import {runTests as test_vm} from "./vm.test.js";
import {runTests as test_portugolrun} from "./portugolrun.test.js";


import { testAll } from "./test.js";

testAll("all",
    test_extras(),
    test_tokenizer(),
    test_parser(),
    test_vmcompiler(),
    test_vm(),
    test_portugolrun()
)();