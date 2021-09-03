import ButtonBar from "./ButtonBar"
import { HomeContextProvider } from "./context"
import Controller from "./Controller"
import HistoryRefining from "./HistoryRefining"
import Summary from "./Summary"

export default function Home(): JSX.Element {
    return <HomeContextProvider>
        <div className="relative flex flex-col h-screen">
            <Summary />
            <Controller />
            <HistoryRefining />
            <ButtonBar />
        </div>
    </HomeContextProvider>
}