import { PoringList } from "presentation/components/Poring"
import useHomeContext from "./context"

export default function Controller(): JSX.Element {
    const { clearRefining, removeLastRefining } = useHomeContext()

    return <div className="flex-none">
        <div className="flex justify-between px-4 py-2">
            <button className="text-primary" onClick={removeLastRefining}>
                Remove one
            </button>
            <button className="text-primary" onClick={clearRefining}>
                Clear all
            </button>
        </div>
    </div>
}