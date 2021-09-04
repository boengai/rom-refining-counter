import { Refining, Refinings, REFINING_TYPE } from "domain/entities"
import { useRefinePrediction } from "domain/hooks"
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react"

const STORAGE_ITEM_REFINING_KEY = 'refining_history'

interface IHomeContextState {
    refining: Array<Refining>
}

const initialContextState: IHomeContextState = {
    refining: [],
}

interface IHomeContext extends IHomeContextState {
    addRefining: (v: REFINING_TYPE) => void
    clearRefining: () => void
    handleState: (s: Partial<IHomeContextState>) => void
    predicted: REFINING_TYPE
    removeLastRefining: () => void
}

const HomeContext = createContext<IHomeContext | null>(null)

function useHomeContext(): IHomeContext {
    const context = useContext(HomeContext)
    if (!context) {
        throw new Error('HomeContext is undefined')
    }

    return context
}

export function HomeContextProvider({ children }: { children: ReactNode }): JSX.Element {
    const [contextState, setContextState] = useState<IHomeContextState>(initialContextState)
    const { predicted, run, train } = useRefinePrediction()

    const handleContextState = (s: Partial<IHomeContextState>): void => {
        setContextState(prev => ({ ...prev, ...s }))
    }
    const handleRefiningChange = useCallback((v: Array<Refining>) => {
        localStorage.setItem(STORAGE_ITEM_REFINING_KEY, JSON.stringify(v))
        handleContextState({ refining: v })
    }, [])

    useMemo(() => {
        const historyJSON = localStorage.getItem(STORAGE_ITEM_REFINING_KEY)
        if (historyJSON) {
            const history = Refinings.fromJSON(JSON.parse(historyJSON))
            handleContextState({ refining: history })
            train(history)
        }

    }, [train])

    return <HomeContext.Provider value={{
        ...contextState,
        predicted,
        addRefining: useCallback((v: REFINING_TYPE) => {
            const refined = Refining.fromType(v)
            handleRefiningChange([...contextState.refining, refined])
            if (refined.isEqual(predicted)) {
                run(contextState.refining)
                return
            }

            train(contextState.refining)
        }, [contextState.refining, handleRefiningChange, predicted, run, train]),
        clearRefining: useCallback(() => {
            handleRefiningChange([])
        }, [handleRefiningChange]),
        removeLastRefining: useCallback(() => {
            const cur = [...contextState.refining]
            cur.pop()
            handleRefiningChange(cur)
            run(cur)
        }, [contextState.refining, handleRefiningChange, run]),
        handleState: handleContextState
    }}>
        {children}
    </HomeContext.Provider>
}

export default useHomeContext