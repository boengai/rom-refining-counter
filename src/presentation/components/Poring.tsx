import PoringGone from 'assets/images/poring_gone.png'
import PoringGood from 'assets/images/poring_good.png'
import PoringHit from 'assets/images/poring_hit.png'
import { Refining, REFINING_TYPE } from 'domain/entities'
import { memo } from 'react'

export function getListBGColor(s: REFINING_TYPE): string {
    switch (s) {
        case REFINING_TYPE.SUCCESS:
            return 'bg-primary border-black'
        case REFINING_TYPE.FAIL:
            return 'bg-warning border-black'
        case REFINING_TYPE.GONE:
            return 'bg-danger border-black'
        default:
            return 'bg-white'
    }
}

enum PoringListSize {
    default = 'w-8 h-8',
    sm = 'w-5 h-5'
}

function UnMemoizePoringList({ data, size = 'default' }: { data: Array<Refining>, size?: 'default' | 'sm' }): JSX.Element {
    if (data.length === 0) {
        return <></>
    }

    return <ul>
        {data.map((r: Refining, i: number) =>
            <li
                key={r.key}
                className={`
                inline-block overflow-hidden p-1 -mr-2 self-center rounded-full border-2
                ${PoringListSize[size]}
                ${getListBGColor(r.value)}
            `}
            >
                <div className="flex h-full w-full items-center">
                    <Poring type={r.value} />
                </div>
            </li>
        )}
    </ul>
}

export const PoringList = memo(UnMemoizePoringList)

function Poring({ type }: { type?: REFINING_TYPE }): JSX.Element {
    switch (type) {
        case REFINING_TYPE.FAIL:
            return <img src={PoringHit} className="inline-block" alt="fail" />
        case REFINING_TYPE.GONE:
            return <img src={PoringGone} className="inline-block" alt="worst" />
        default:
            return <img src={PoringGood} className="inline-block" alt="good" />
    }
}

const MemoizePoring = memo(Poring)

export default MemoizePoring