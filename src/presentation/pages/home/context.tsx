import { Refining, REFINING_TYPE } from "domain/entities"
import { createContext, ReactNode, useContext, useMemo, useState } from "react"

const STORAGE_ITEM_REFINING_KEY = 'refining_history'

interface IHomeContextState {
    refining: Array<Refining>
}

const initialContextState: IHomeContextState = {
    refining: []
}

interface IHomeContext extends IHomeContextState {
    addRefining: (v: REFINING_TYPE) => void
    clearRefining: () => void
    handleState: (s: Partial<IHomeContextState>) => void
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
    const handleContextState = (s: Partial<IHomeContextState>): void => {
        setContextState(prev => ({ ...prev, ...s }))
    }
    const handleRefiningChange = (v: Array<Refining>) => {
        handleContextState({ refining: v })
        localStorage.setItem(STORAGE_ITEM_REFINING_KEY, JSON.stringify(v))
    }

    useMemo(() => {
        const historyJSON = localStorage.getItem(STORAGE_ITEM_REFINING_KEY)
        if (historyJSON) {
            const history: Array<Refining> = JSON.parse(historyJSON)
            handleContextState({ refining: history })
        }

    }, [])

    return <HomeContext.Provider value={{
        ...contextState,
        addRefining: (v: REFINING_TYPE) => {
            handleRefiningChange([...contextState.refining, Refining.fromType(v)])
        },
        clearRefining: () => {
            handleRefiningChange([])
        },
        removeLastRefining: () => {
            const cur = [...contextState.refining]
            cur.pop()
            handleRefiningChange(cur)
        },
        handleState: handleContextState
    }}>
        {children}
    </HomeContext.Provider>
}

export default useHomeContext