import { Refining, Refinings, REFINING_TYPE } from "domain/entities"
import { getListBGColor, Poring, PoringList } from "presentation/components"
import useHomeContext from "./context"

function SummaryRefining({ found, pattern }: { found: number, pattern: string }): JSX.Element {

    if (found === 0) {
        return <div className="w-full flex justify-center items-center p-1" style={{ minHeight: 58 }}>-</div>
    }

    return <div className={`
            w-full p-1 flex flex-col items-center rounded
        `}>
        <PoringList data={Refinings.fromString(pattern)} size="sm" />
        <p>
            <strong>{found} </strong>
            <span>{found > 1 ? 'times' : 'time'}</span>
        </p>
    </div>
}

function SummaryControl(): JSX.Element {
    const { refining, predicted } = useHomeContext()

    if (!refining || refining.length === 0) {
        return <p className="w-full text-center italic">Waiting for your information</p>
    }

    if (refining.length < 30) {
        return <p className="text-center italic">Need more data</p>
    }

    const refiningTest = refining.map((r: Refining) => r.value).join('')
    const last3Refining = refiningTest.substr(refiningTest.length - 4)
    const refiningTypes: Record<string, number> = {
        [`${REFINING_TYPE.GONE}`]: 0,
        [`${REFINING_TYPE.FAIL}`]: 0,
        [`${REFINING_TYPE.SUCCESS}`]: 0
    }

    Object.keys(refiningTypes).forEach((r: string) => {
        const regExp = new RegExp(`${last3Refining}${r}`, "g")
        const founds = refiningTest.match(regExp)
        refiningTypes[`${r}`] = founds?.length ?? 0
    })

    return <>
        <div className="w-full flex gap4">
            {Object.keys(refiningTypes).map((r: string) => (
                <SummaryRefining found={refiningTypes[`${r}`]} key={r} pattern={`${last3Refining}${r}`} />
            ))}
        </div>
        <p className="flex justify-center items-center font-bold">
            {predicted === REFINING_TYPE.UNKNOWN && <span>NN: <i>couldn't predict</i></span>}
            {predicted !== REFINING_TYPE.UNKNOWN && (
                <>
                    <span>NN: <i>the prediction result is</i></span>
                    <span className={`
                        flex flex-col justify-center items-center overflow-hidden p-1 rounded-full border-2 border-white w-7 h-7 ml-2 animate-shake
                        ${getListBGColor(predicted)}
                    `}>
                        <Poring type={predicted} />
                    </span>
                </>
            )}
        </p>
    </>
}

export default function Summary(): JSX.Element {
    return <div className="flex-none border-b" style={{ minHeight: 111 }}>
        <div className="h-full flex flex-col justify-center items-center px-4 py-2">
            <SummaryControl />
        </div>
    </div>
}