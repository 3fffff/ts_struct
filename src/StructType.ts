export default class StructType {
    #bytesArray: DataView
    #struct: any
    #dataMap: Map<string, Array<any>>
    #bytes: number

    constructor(structType: object, arr: ArrayBuffer, packing: number = 1) {
        this.#dataMap = new Map()
        this.#dataMap.set("int8", [this.#int8.bind(this), 1])
        this.#dataMap.set("uint8", [this.#uint8.bind(this), 1])
        this.#dataMap.set("int16", [this.#int16.bind(this), 2])
        this.#dataMap.set("uint16", [this.#uint16.bind(this), 2])
        this.#dataMap.set("int32", [this.#int32.bind(this), 4])
        this.#dataMap.set("uint32", [this.#uint32.bind(this), 4])
        this.#dataMap.set("int64", [this.#int64.bind(this), 8])
        this.#dataMap.set("uint64", [this.#uint64.bind(this), 8])
        this.#dataMap.set("float32", [this.#float32.bind(this), 4])
        this.#dataMap.set("float64", [this.#float64.bind(this), 8])
        this.#bytes = this.#calcOffsets(structType, packing)
        this.#bytesArray = this.#bytes == arr.byteLength ? new DataView(arr.transfer()) : new DataView(new ArrayBuffer(this.#bytes))
    }

    updateBytes(arr: ArrayBuffer): boolean {
        if (arr.byteLength == this.#bytes) {
            this.#bytesArray = new DataView(arr as ArrayBuffer)
            return true
        }
        return false
    }

    getValue(key: string): number {
        if (key in this.#struct && this.#bytesArray)
            return this.#struct[key]["func"](this.#struct[key]["offset"])
        return 0
    }

    getArray():ArrayBuffer{
        return this.#bytesArray.buffer as ArrayBuffer
    }

    #calcOffsets(structType: object, pack: number) {
        let offset: number = 0
        this.#struct = {}
        for (const key of Object.keys(structType)) {
            const val = this.#dataMap.get((structType as any)[key])
            if (val != undefined) {
                this.#struct[key] = { func: val[0], offset: offset }
                if (val[1] < pack)
                    offset += pack
                else
                    offset += val[1]
            }
            else return 0
        }
        return offset
    }

    #int8(index: number): number {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 1)
            return this.#bytesArray.getInt8(index)
        return 0
    }

    #uint8(index: number): number {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 1)
            return this.#bytesArray.getUint8(index)
        return 0
    }

    #int16(index: number): number {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 2)
            return this.#bytesArray.getInt16(index)
        return 0
    }

    #uint16(index: number): number {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 2)
            return this.#bytesArray.getUint16(index)
        return 0
    }

    #int32(index: number): number {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            return this.#bytesArray.getInt32(index)
        return 0
    }

    #uint32(index: number): number {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            return this.#bytesArray.getUint32(index)
        return 0
    }

    #int64(index: number): BigInt {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            return this.#bytesArray.getBigInt64(index)
        return BigInt(0)
    }

    #uint64(index: number): BigInt {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            return this.#bytesArray.getBigUint64(index)
        return BigInt(0)
    }

    #float32(index: number): number {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            return this.#bytesArray.getFloat32(index)
        return 0
    }

    #float64(index: number): number {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            return this.#bytesArray.getFloat64(index)
        return 0
    }
}