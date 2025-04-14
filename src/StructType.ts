type TypeFunc = {
    getFunc: (index: number) => number | bigint;
    setFunc: (index: number, value: number | bigint) => void;
    offset: number;
};

export default class StructType {
    #bytesArray: DataView
    #struct: any
    #dataMap: Map<string, TypeFunc>
    #shared: boolean

    constructor(structType: object, shared: boolean, packing: number = 1, arr: ArrayBuffer | SharedArrayBuffer | null = null) {
        this.#shared = shared
        this.#dataMap = new Map()
        this.#dataMap.set("int8", { getFunc: this.#getInt8, setFunc: this.#setInt8, offset: 1 })
        this.#dataMap.set("uint8", { getFunc: this.#getUint8, setFunc: this.#setUint8, offset: 1 })
        this.#dataMap.set("int16", { getFunc: this.#getInt16, setFunc: this.#setInt16, offset: 2 })
        this.#dataMap.set("uint16", { getFunc: this.#getUint16, setFunc: this.#setUint16, offset: 2 })
        this.#dataMap.set("int32", { getFunc: this.#getInt32, setFunc: this.#setInt32, offset: 4 })
        this.#dataMap.set("uint32", { getFunc: this.#getUint32, setFunc: this.#setUint32, offset: 4 })
        this.#dataMap.set("int64", { getFunc: this.#getInt64, setFunc: this.#setInt64, offset: 8 })
        this.#dataMap.set("uint64", { getFunc: this.#getUint64, setFunc: this.#setUint64, offset: 8 })
        this.#dataMap.set("float32", { getFunc: this.#getFloat32, setFunc: this.#setFloat32, offset: 4 })
        this.#dataMap.set("float64", { getFunc: this.#getFloat64, setFunc: this.#setFloat64, offset: 8 })
        const bytes = this.#calcOffsets(structType, packing)
        if(arr == null)
            this.#bytesArray = new DataView(shared ? new SharedArrayBuffer(bytes) : new ArrayBuffer(bytes))
        else
            this.#bytesArray = new DataView(arr)
    }

    get sharedArray() {
        return this.#shared
    }

    setFromBytes(arr: ArrayBuffer | SharedArrayBuffer): boolean {
        if (arr.byteLength == this.#bytesArray.buffer.byteLength) {
            const ui8 = new Uint8Array(arr)
            for (let i = 0; i < arr.byteLength; i++)
                this.#bytesArray.setUint8(i, ui8[i])
            return true
        }
        return false
    }

    setFromStruct(obj: object) {
        const structKeys = Object.keys(this.#struct)
        for (const key of Object.keys(obj)) {
            if (structKeys.includes(key))
                this.setValue(key, (obj as any)[key])
        }
    }

    getValue(key: string): number | BigInt | null {
        if (key in this.#struct && this.#bytesArray)
            return this.#struct[key]["getFunc"](this.#struct[key]["offset"])
        return null
    }

    setValue(key: string, value: number | bigint) {
        if (key in this.#struct && this.#bytesArray)
            this.#struct[key]["setFunc"](this.#struct[key]["offset"], value)
    }

    getArray(): ArrayBuffer | SharedArrayBuffer {
        return this.#bytesArray.buffer instanceof ArrayBuffer ? this.#bytesArray.buffer as ArrayBuffer : this.#bytesArray.buffer as SharedArrayBuffer
    }

    #calcOffsets(structType: object, pack: number) {
        let offset: number = 0
        this.#struct = {}
        for (const key of Object.keys(structType)) {
            const val = this.#dataMap.get((structType as any)[key]) as TypeFunc
            if (val != undefined) {
                this.#struct[key] = { getFunc: val["getFunc"], setFunc: val["setFunc"], offset: offset }
                if (val["offset"] < pack)
                    offset += pack
                else
                    offset += val["offset"]
            }
            else return 0
        }
        return offset
    }

    #getInt8 = (index: number): number => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 1)
            return this.#bytesArray.getInt8(index)
        return 0
    }

    #getUint8 = (index: number): number => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 1)
            return this.#bytesArray.getUint8(index)
        return 0
    }

    #getInt16 = (index: number): number => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 2)
            return this.#bytesArray.getInt16(index)
        return 0
    }

    #getUint16 = (index: number): number => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 2)
            return this.#bytesArray.getUint16(index)
        return 0
    }

    #getInt32 = (index: number): number => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            return this.#bytesArray.getInt32(index)
        return 0
    }

    #getUint32 = (index: number): number => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            return this.#bytesArray.getUint32(index)
        return 0
    }

    #getInt64 = (index: number): bigint => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            return this.#bytesArray.getBigInt64(index)
        return BigInt(0)
    }

    #getUint64 = (index: number): bigint => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            return this.#bytesArray.getBigUint64(index)
        return BigInt(0)
    }

    #getFloat32 = (index: number): number => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            return this.#bytesArray.getFloat32(index)
        return 0
    }

    #getFloat64 = (index: number): number => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            return this.#bytesArray.getFloat64(index)
        return 0
    }

    #setInt8 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 1)
            return this.#bytesArray.setInt8(index, value as number)
    }

    #setUint8 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 1)
            return this.#bytesArray.setUint8(index, value as number)
    }

    #setInt16 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 2)
            return this.#bytesArray.setInt16(index, value as number)
    }

    #setUint16 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 2)
            return this.#bytesArray.setUint16(index, value as number)
    }

    #setInt32 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            return this.#bytesArray.setInt32(index, value as number)
    }

    #setUint32 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            return this.#bytesArray.setUint32(index, value as number)
    }

    #setInt64 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            return this.#bytesArray.setBigInt64(index, value as bigint)
    }

    #setUint64 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            this.#bytesArray.setBigUint64(index, value as bigint)
    }

    #setFloat32 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 4)
            this.#bytesArray.setFloat32(index, value as number)
    }

    #setFloat64 = (index: number, value: number | bigint) => {
        if (this.#bytesArray && index <= this.#bytesArray.byteLength - 8)
            return this.#bytesArray.setFloat64(index, value as number)
    }
}