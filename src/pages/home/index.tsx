import ButtonBar from "./ButtonBar";
import { HomeContextProvider } from "./context";
import HistoryRefining from "./HistoryRefining";

export default function Home(): JSX.Element {
    return <HomeContextProvider>
        <div className="relative sm:container max-w-screen-sm mx-auto flex flex-col px-4 w-full h-full" style={{ height: 'calc(100vh - 71px)' }}>
            <HistoryRefining />
        </div>
        <ButtonBar />
    </HomeContextProvider>
}