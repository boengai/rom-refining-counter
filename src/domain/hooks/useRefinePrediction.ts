import brain from 'brain.js/src'
import { parseRefiningTypeFromPrediction, Refining, Refinings, REFINING_TYPE } from "domain/entities"
import { useCallback, useState } from 'react'

const nn = new brain.recurrent.LSTM()

interface IUseRefinePredictionState {
    predicted: REFINING_TYPE
}

interface IUseRefinePrediction extends IUseRefinePredictionState {
    run: (d: Array<Refining>) => void
    train: (d: Array<Refining>) => void
}

const initialHookState: IUseRefinePredictionState = {
    predicted: REFINING_TYPE.UNKNOWN
}

export default function useRefinePrediction(): IUseRefinePrediction {
    const [hookState, setHookState] = useState<IUseRefinePredictionState>(initialHookState)
    const handleHookState = useCallback((s: Partial<IUseRefinePredictionState>) => {
        setHookState(prev => ({ ...prev, ...s }))
    }, [setHookState])

    const run = useCallback((data: Array<Refining>) => {
        if (data.length <= 30) {
            return
        }

        const result = nn.run<Array<string>, string>(Refinings.getLast4(data).map((r: Refining) => r.toPrediction()))

        handleHookState({ predicted: parseRefiningTypeFromPrediction(`${result}`) })

    }, [handleHookState])

    const train = useCallback((data: Array<Refining>) => {
        if (data.length <= 30) {
            return
        }

        const extracted = Refinings.toTrainingSet(data)
        if (!extracted) {
            return
        }
        nn.train(extracted, { log: process.env.NODE_ENV !== 'production', errorThresh: 1 })

        run(data)
    }, [run])

    return {
        predicted: hookState.predicted,
        run,
        train,
    }
}