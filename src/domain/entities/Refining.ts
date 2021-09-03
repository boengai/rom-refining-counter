import { v4 as uuidv4 } from 'uuid'

export enum REFINING_TYPE {
    UNKNOWN,
    FAIL,
    GONE,
    SUCCESS
}

function parseRefiningType(t: string): REFINING_TYPE {
    switch (t) {
        case `${REFINING_TYPE.FAIL}`:
            return REFINING_TYPE.FAIL
        case `${REFINING_TYPE.GONE}`:
            return REFINING_TYPE.GONE
        case `${REFINING_TYPE.SUCCESS}`:
            return REFINING_TYPE.SUCCESS
        default:
            return REFINING_TYPE.UNKNOWN
    }
}

export default class Refining {
    readonly key!: string
    readonly value!: REFINING_TYPE

    constructor(params: Required<Refining>) {
        Object.assign(this, params)
    }

    static fromType(_v: REFINING_TYPE): Refining {
        return new Refining({ key: uuidv4(), value: _v })
    }

    static fromString(_v: string): Array<Refining> {
        const ss = _v.split('')
        return ss.map((r: string, i: number) => new Refining({ key: `${uuidv4()}-${i}`, value: parseRefiningType(r) }))
    }
}