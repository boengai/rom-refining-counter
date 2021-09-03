import Home from 'presentation/pages/home'

function App() {
  return (
    <div className="App">
      <div className="fixed w-screen h-screen opacity-10 overflow-hidden z-0">
        <div className="flex flex-col justify-center items-center h-full max-w-screen-sm mx-auto px-4">
          <p className="italic text-4xl sm:text-7xl mb-4 sm:mb-8"><q>There is a pattern in the ROM refining</q></p >
          <p className="w-full italic text-right sm:text-lg">- Someone who got +15</p>
        </div>
      </div>
      <div className="z-10">
        <Home />
      </div>
    </div>
  )
}

export default App
