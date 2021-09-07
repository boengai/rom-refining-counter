import brain, { INeuralNetworkTrainingOptions } from 'brain.js/src'
import { parseRefiningTypeFromPrediction, Refining, Refinings, REFINING_TYPE } from "domain/entities"
import { useCallback } from 'react'
import usePrediction, { IUsePredictionState } from './usePrediction'

const WINDOW_SIZE = 4
const nn = new brain.recurrent.LSTM({
    activation: 'relu'
})
const networkTrainingOptions: Partial<INeuralNetworkTrainingOptions> = {
    log: process.env.NODE_ENV !== 'production',
    iterations: 100,
    errorThresh: 0.1
}

interface IUsePredictionRefineLSTM extends IUsePredictionState<REFINING_TYPE> {
    run: (d: Array<Refining>) => void
    train: (d: Array<Refining>) => void
}

const initialHookState: IUsePredictionState<REFINING_TYPE> = {
    predicted: REFINING_TYPE.UNKNOWN,
    training: false
}

export default function usePredictionRefineLSTM(): IUsePredictionRefineLSTM {
    const { predicted, training, handleHookState } = usePrediction<REFINING_TYPE>(initialHookState)

    const run = useCallback((data: Array<Refining>) => {
        if (training) {
            return
        }
        if (data.length <= 30) {
            return
        }

        const input = Refinings.getLast(data, WINDOW_SIZE).map((r: Refining) => r.toLSTMPrediction()).join('')
        const output = nn.run(input)

        handleHookState({ predicted: parseRefiningTypeFromPrediction(output.substr(0, 3)), training: false })

    }, [handleHookState, training])

    const train = useCallback((data: Array<Refining>) => {
        if (training) {
            return
        }
        if (data.length <= 30) {
            return
        }

        const trainingSet = Refinings.toLSTMTrainingSet(data, WINDOW_SIZE)
        if (!trainingSet) {
            return
        }

        handleHookState({ training: true })
        nn.train(trainingSet, networkTrainingOptions)
        run(data)

    }, [handleHookState, run, training])

    return {
        predicted,
        training,
        run,
        train,
    }
}