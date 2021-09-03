import { Refining, REFINING_TYPE } from "domain/entities"
import { PoringList } from "presentation/components/Poring"
import useHomeContext from "./context"

function SummaryRefining({ found, pattern }: { found: number, pattern: string }): JSX.Element {

    if (found === 0) {
        return <div className="w-full" />
    }

    return <div className={`
            w-full p-1 flex flex-col items-center rounded border-4
            ${pattern.substr(-1) === `${REFINING_TYPE.SUCCESS}` ? 'border-primary' : 'border-transparent'}
        `}>
        <PoringList data={Refining.fromString(pattern)} pingLast={true} size="sm" />
        <p>
            <strong>{found} </strong>
            <span>{found > 1 ? 'times' : 'time'}</span>
        </p>
    </div>
}

function SummaryControl(): JSX.Element {
    const { refining } = useHomeContext()

    if (!refining || refining.length < 30) {
        return <p className="text-center italic">Waiting for your information</p>
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

    if (Object.keys(refiningTypes).filter((r: string) => refiningTypes[`${r}`] > 0).length > 0) {
        return <>
            <p className="text-center italic font-bold">If there are some patterns literally, it can be:</p>
            <div className="w-full flex gap4">
                {Object.keys(refiningTypes).map((r: string) => (
                    <SummaryRefining found={refiningTypes[`${r}`]} key={r} pattern={`${last3Refining}${r}`} />
                ))}
            </div>
        </>
    }

    return <p className="text-center italic">Need more data</p>
}

export default function Summary(): JSX.Element {
    return <div className="flex-none border-b">
        <div className="flex flex-col px-4 py-2">
            <SummaryControl />
        </div>
    </div>
}