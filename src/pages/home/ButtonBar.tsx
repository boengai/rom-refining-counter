import Button from "components/Button";
import ImgPoring from "components/ImgPoring";
import useHomeContext from "./context";


export default function ButtonBar(): JSX.Element {
    const { addRefining } = useHomeContext()

    return <footer className="fixed bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg bottom-0 w-full">
        <div className="sm:container max-w-screen-sm mx-auto px-4 py-1 flex gap-4">
            <Button block size="lg" type="primary" onClick={() => addRefining(-1)}><ImgPoring state={-1} /></Button>
            <Button block size="lg" type="primary" onClick={() => addRefining(0)}><ImgPoring state={0} /></Button>
            <Button block size="lg" type="primary" onClick={() => addRefining(1)}><ImgPoring /></Button>
        </div>
    </footer>
}