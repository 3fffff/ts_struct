import StructType from "./StructType.js"

const test = { a: "int8ddff", b: "uint8", c: "float32" }
const testA = new Uint8Array([10, 10, 200, 200, 255, 45])
const str = new StructType(test, testA.buffer)
console.log(str.getValue("c"))
console.log("hello")
const testB = new Uint8Array([10, 10, 200, 20, 255, 45])
str.updateBytes(testB.buffer)

console.log(str.getValue("c"))
console.log("hello")