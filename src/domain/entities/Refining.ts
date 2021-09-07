import { INeuralNetworkTrainingData, IRNNTrainingData, NeuralNetworkInput, RNNTrainingValue } from 'brain.js'
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

    is(_e: REFINING_TYPE): boolean {
        return this.value === _e
    }

    isRefinedSuccess(): number {
        return this.is(REFINING_TYPE.SUCCESS) ? 1 : 0
    }

    toLSTMPrediction(): string {
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

    toNNPrediction(): number {
        switch (this.value) {
            case REFINING_TYPE.GONE:
                return 0
            case REFINING_TYPE.FAIL:
                return 0.5
            case REFINING_TYPE.SUCCESS:
                return 1
            default:
                return 0
        }
    }

    static fromType(_v: REFINING_TYPE): Refining {
        return new Refining({ key: uuidv4(), value: _v })
    }
}

export class Refinings {
    static fromJSON(_j: Array<any>): Array<Refining> {
        return _j.map((r: any) => new Refining({ key: r['key'], value: r['value'] }))
    }

    static fromString(_v: string): Array<Refining> {
        const ss = _v.split('')
        return ss.map((r: string, i: number) => new Refining({ key: `${uuidv4()}-${i}`, value: parseRefiningType(r) }))
    }

    static getLast(_d: Array<Refining>, _s: number): Array<Refining> {
        if (_d.length < _s) return []

        const dataLength = _d.length

        const data: Array<Refining> = []
        for (let ii = _s; ii > 0; ii--) {
            data.push(_d[dataLength - ii])
        }

        return data
    }

    static toLSTMTrainingSet(_d: Array<Refining>, _w: number, _l?: number): Array<IRNNTrainingData> {
        if (_w <= 0) return []

        const trainingSet = _d.reduce((acc: Array<IRNNTrainingData>, cur: Refining, i: number) => {
            if (!_d[i + _w]) {
                return acc
            }

            let input: RNNTrainingValue = ''
            for (let ii = 0; ii < _w; ii++) {
                input += _d[i + ii].toLSTMPrediction()
            }

            acc.push({
                input: input,
                output: _d[i + _w].toLSTMPrediction()
            })

            return acc
        }, [])

        if (_l) {
            return trainingSet.filter((_, i: number) => i >= trainingSet.length - _l)
        }

        return trainingSet
    }

    static toNNTrainingSet(_d: Array<Refining>, _w: number, _l?: number): Array<INeuralNetworkTrainingData> {
        if (_w <= 0) return []

        const trainingSet = _d.reduce((acc: Array<INeuralNetworkTrainingData>, cur: Refining, i: number) => {
            if (!_d[i + _w]) {
                return acc
            }

            const input: NeuralNetworkInput = []
            for (let ii = 0; ii < _w; ii++) {
                input.push(_d[i + ii].toNNPrediction())
            }

            acc.push({
                input: input,
                output: [_d[i + _w].toNNPrediction()]
            })

            return acc
        }, [])

        if (_l) {
            return trainingSet.filter((_, i: number) => i >= trainingSet.length - _l)
        }

        return trainingSet
    }
}