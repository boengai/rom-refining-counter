import { PoringList } from "presentation/components/Poring"
import useHomeContext from "./context"

export default function HistoryRefining(): JSX.Element {
    const { refining } = useHomeContext()

    return <div className="flex-grow px-4 py-1 overflow-y-scroll">
        <PoringList data={refining} />
    </div>
}