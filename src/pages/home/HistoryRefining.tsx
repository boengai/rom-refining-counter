import ImgPoring from "components/ImgPoring"
import useHomeContext, { IRefining } from "./context"

function getListBGColor(s: number): string {
    switch (s) {
        case 1:
            return 'bg-green-700 border-green-200';
        case 0:
            return 'bg-yellow-700 border-yellow-200';
        case -1:
            return 'bg-red-700 border-red-200';
        default:
            return 'bg-white';
    }
}

export default function HistoryRefining(): JSX.Element {
    const { clearRefining, refining, removeLastRefining } = useHomeContext()

    return <div className="relative flex-grow flex flex-col gap-2">
        <div className="flex justify-between py-2">
            <button className="text-primary" onClick={removeLastRefining}>
                Remove one
            </button>
            <button className="text-primary" onClick={clearRefining}>
                Clear all
            </button>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll flex-grow">
            <ul>
                {refining.map((r: IRefining) =>
                    <li
                        key={r.time}
                        className={`
                            inline-block overflow-hidden p-1 -mr-2 w-8 h-8 self-center rounded-full border-2
                            ${getListBGColor(r.value)}
                        `}
                    >
                        <div className="flex h-full w-full items-center">
                            <ImgPoring state={r.value} />
                        </div>
                    </li>
                )}
            </ul>
        </div>
    </div>
}