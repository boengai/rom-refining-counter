import { v4 as uuidv4 } from 'uuid'

export enum REFINING_TYPE {
    UNKNOWN,
    GONE,
    FAIL,
    SUCCESS
}

export function parseRefiningType(t: string): REFINING_TYPE {
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

export function parseRefiningTypeFromPrediction(t: string): REFINING_TYPE {
    switch (t) {
        case '010':
            return REFINING_TYPE.FAIL
        case '100':
            return REFINING_TYPE.GONE
        case '001':
            return REFINING_TYPE.SUCCESS
        default:
            return REFINING_TYPE.UNKNOWN
    }
}

export default class Refining {
    readonly key!: string
    readonly value!: REFINING_TYPE

    constructor(params: Partial<Refining>) {
        Object.assign(this, params)
    }

    isEqual(_e: REFINING_TYPE): boolean {
        return this.value === _e
    }

    toPrediction(): string {
        switch (this.value) {
            case REFINING_TYPE.GONE:
                return '100'
            case REFINING_TYPE.FAIL:
                return '010'
            case REFINING_TYPE.SUCCESS:
                return '001'
            default:
                return '000'
        }
    }

    static fromType(_v: REFINING_TYPE): Refining {
        return new Refining({ key: uuidv4(), value: _v })
    }
}


interface IRefineTrainingSet {
    input: Array<string>
    output: string
}
export class Refinings {
    static fromJSON(_j: Array<any>): Array<Refining> {
        return _j.map((r: any) => new Refining({ key: r['key'], value: r['value'] }))
    }

    static fromString(_v: string): Array<Refining> {
        const ss = _v.split('')
        return ss.map((r: string, i: number) => new Refining({ key: `${uuidv4()}-${i}`, value: parseRefiningType(r) }))
    }

    static getLast4(_d: Array<Refining>): Array<Refining> {
        if (_d.length < 4) return []

        const dataLength = _d.length
        return [
            _d[dataLength - 4],
            _d[dataLength - 3],
            _d[dataLength - 2],
            _d[dataLength - 1]
        ]
    }

    static toTrainingSet(_d: Array<Refining>): Array<IRefineTrainingSet> {
        return _d.reduce((acc: Array<IRefineTrainingSet>, cur: Refining, i: number) => {
            if (!_d[i + 4]) {
                return acc
            }

            acc.push({
                input: [_d[i].toPrediction(), _d[i + 1].toPrediction(), _d[i + 2].toPrediction(), _d[i + 3].toPrediction()],
                output: _d[i + 4].toPrediction()
            })

            return acc
        }, [])
    }
}