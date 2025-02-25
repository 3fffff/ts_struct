import { test } from 'uvu';
import * as assert from 'uvu/assert';
import StructType from "../src/StructType.js"

test("Correct keys", () => {
    const test = { a: "int8", b: "uint8", c: "float32" }
    const testA = new Uint8Array([10, 50, 200, 200, 255, 45])
    const str = new StructType(test, testA.buffer)
    assert.is(str.getValue("a"), 10);
    assert.is(str.getValue("b"), 50);
});

test("Data pack", () => {
    const test = { a: "int8", b: "uint8", c: "float32" }
    const testA = new Uint8Array([10, 50, 200, 200, 255, 45])
    const str = new StructType(test, testA.buffer, 4)
    assert.is(str.getValue("a"), 10);
    assert.is(str.getValue("b"), 50);
});

test("Incorrect keys", () => {
    const test1 = { a: "int8fgg", b: "uint8", c: "float32" }
    const test2 = { a: "int8fgg", b: "uinafet8sdgfsd", c: "float32" }
    const test3 = { a: "int8fgg", b: "uint8", c: "sdgfsdfgfs" }
    const testA = new Uint8Array([10, 50, 200, 200, 255, 45])
    const str1 = new StructType(test1, testA.buffer)
    const str2 = new StructType(test2, testA.buffer)
    const str3 = new StructType(test3, testA.buffer)
    assert.is(str1.getValue("a"), 0);
    assert.is(str2.getValue("b"), 0);
    assert.is(str3.getValue("c"), 0);
});


test.run();