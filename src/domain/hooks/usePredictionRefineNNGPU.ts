import brain, { INeuralNetworkTrainingOptions } from 'brain.js/src'
import { Refining, Refinings, REFINING_TYPE } from "domain/entities"
import { useCallback } from 'react'
import usePrediction, { IUsePredictionState } from './usePrediction'

const WINDOW_SIZE = 5
const network = new brain.NeuralNetworkGPU({
    hiddenLayers: [4, 3, 4]
})

const networkTrainingOptions: Partial<INeuralNetworkTrainingOptions> = {
    log: process.env.NODE_ENV !== 'production',
    iterations: 100,
    errorThresh: 0.1
}

interface IUsePredictionRefineNNGPU extends IUsePredictionState<REFINING_TYPE> {
    run: (d: Array<Refining>) => void
    train: (d: Array<Refining>) => void
}

const initialHookState: IUsePredictionState<REFINING_TYPE> = {
    predicted: REFINING_TYPE.UNKNOWN,
    training: false
}

export default function usePredictionRefineNNGPU(): IUsePredictionRefineNNGPU {
    const { predicted, training, handleHookState } = usePrediction<REFINING_TYPE>(initialHookState)

    const run = useCallback((data: Array<Refining>) => {
        if (training) {
            return
        }
        if (data.length <= 30) {
            return
        }

        const result = network.run(Refinings.getLast(data, WINDOW_SIZE).map((r: Refining) => r.toNNPrediction()))
        console.log("run -> result", result) // TODO: WIP

        handleHookState({ training: false })

    }, [handleHookState, training])

    const train = useCallback((data: Array<Refining>) => {
        if (training) {
            return
        }

        handleHookState({ training: true })

        if (data.length <= 30) {
            return
        }
        const trainingSet = Refinings.toNNTrainingSet(data, WINDOW_SIZE)
        if (!trainingSet) {
            return
        }

        network.trainAsync(trainingSet, networkTrainingOptions)
            .then(() => {
                run(data)
            })
            .catch(e => {
                console.error(e)
                handleHookState({ predicted: REFINING_TYPE.UNKNOWN, training: false })
            })

    }, [handleHookState, training, run])

    return {
        predicted,
        training,
        run,
        train,
    }
}