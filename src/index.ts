import StructType from "./StructType.js"

const test = { a: "int8", b: "uint16", c: "float32" }
const str = new StructType(test, true, 1)
console.log(str.getValue("a"))
console.log("hello")
const testB = new Uint8Array([10, 10, 200, 20, 255, 45, 56])
str.setFromBytes(testB.buffer)

console.log(str.getValue("b"))

str.setValue("b", 40)

console.log(str.getValue("b"))

str.setFromStruct({ a: 5, b: 20, c: 43.2 })

console.log(str.getArray())
console.log(str.getValue("a"))
console.log(str.getValue("b"))
console.log(str.getValue("c"))

console.log("hello")