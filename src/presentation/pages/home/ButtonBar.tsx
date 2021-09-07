import { Button, Poring } from "presentation/components"
import { REFINING_TYPE } from "domain/entities"
import useHomeContext from "./context"
import { memo } from "react"

function ButtonBar(): JSX.Element {
    const { addRefining } = useHomeContext()

    return <footer className="flex-none bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg w-full">
        <div className="sm:container max-w-screen-sm mx-auto px-4 py-2 flex gap-4">
            <Button block size="lg" type="danger" onClick={() => addRefining(REFINING_TYPE.GONE)}><Poring type={REFINING_TYPE.GONE} /></Button>
            <Button block size="lg" type="warning" onClick={() => addRefining(REFINING_TYPE.FAIL)}><Poring type={REFINING_TYPE.FAIL} /></Button>
            <Button block size="lg" type="primary" onClick={() => addRefining(REFINING_TYPE.SUCCESS)}><Poring /></Button>
        </div>
    </footer>
}

const MemoizeButtonBar = memo(ButtonBar)

export default MemoizeButtonBar
