import { useCallback, useState } from 'react'

export interface IUsePredictionState<T> {
    predicted: T
    training: boolean
}

export interface IUsePrediction<T> extends IUsePredictionState<T> {
    handleHookState: (s: Partial<IUsePredictionState<T>>) => void
}


export default function usePrediction<T>(initial: IUsePredictionState<T>): IUsePrediction<T> {
    const [hookState, setHookState] = useState<IUsePredictionState<T>>(initial)
    const handleHookState = useCallback((s: Partial<IUsePredictionState<T>>) => {
        setHookState(prev => ({ ...prev, ...s }))
    }, [setHookState])

    return {
        ...hookState,
        handleHookState
    }
}