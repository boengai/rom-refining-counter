import { memo } from "react"
import useHomeContext from "./context"

function Controller(): JSX.Element {
    const { clearRefining, removeLastRefining } = useHomeContext()

    return <div className="flex-none">
        <div className="flex justify-between px-4 py-2">
            <button className="text-primary" onClick={clearRefining}>
                Clear all
            </button>
            <button className="text-primary" onClick={removeLastRefining}>
                Remove one
            </button>
        </div>
    </div>
}

const MemoizeController = memo(Controller)

export default MemoizeController