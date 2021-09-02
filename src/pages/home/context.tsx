import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_ITEM_REFINING_KEY = 'refining_history'

export interface IRefining {
    time: number
    value: number
}

interface IHomeContextState {
    refining: Array<IRefining>
}

const initialContextState: IHomeContextState = {
    refining: []
}

interface IHomeContext extends IHomeContextState {
    addRefining: (v: number) => void
    clearRefining: () => void
    handleState: (s: Partial<IHomeContextState>) => void
    removeLastRefining: () => void
}

const HomeContext = createContext<IHomeContext | null>(null);

function useHomeContext(): IHomeContext {
    const context = useContext(HomeContext)
    if (!context) {
        throw new Error('HomeContext is undefined');
    }

    return context
}

export function HomeContextProvider({ children }: { children: ReactNode }): JSX.Element {
    const [contextState, setContextState] = useState<IHomeContextState>(initialContextState)
    const handleContextState = (s: Partial<IHomeContextState>): void => {
        setContextState(prev => ({ ...prev, ...s }))
    }
    const handleRefiningChange = (v: Array<IRefining>) => {
        handleContextState({ refining: v })
        localStorage.setItem(STORAGE_ITEM_REFINING_KEY, JSON.stringify(v))
    }

    useMemo(() => {
        const historyJSON = localStorage.getItem(STORAGE_ITEM_REFINING_KEY)
        if (historyJSON) {
            const history: Array<IRefining> = JSON.parse(historyJSON)
            handleContextState({ refining: history })
        }

    }, [])

    return <HomeContext.Provider value={{
        ...contextState,
        addRefining: useCallback((v: number) => {
            handleRefiningChange([...contextState.refining, { time: window.performance.now(), value: v }])
        }, [contextState.refining]),
        clearRefining: useCallback(() => {
            handleRefiningChange([])
        }, [contextState.refining]),
        removeLastRefining: useCallback(() => {
            const cur = [...contextState.refining]
            cur.pop()
            handleRefiningChange(cur)
        }, [contextState.refining]),
        handleState: handleContextState
    }}>
        {children}
    </HomeContext.Provider>
}

export default useHomeContext