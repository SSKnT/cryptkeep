
const CaptureTheFlag = () => {
    return(
        <section className="relative flex h-[100vh-20%] w-full bg-background dark:bg-background py-5">
            <div className="absolute inset-8 w-full bg-[url('/flags-1.png')] bg-bottom bg-no-repeat opacity-10 "
                aria-hidden="true" />
            
            <div className="flex flex-col h-full w-full rounded-lg p-5 z-10">
                <h1 className="text-[10rem] font-bold font-bebas text-center">Capture {" "}
                    <span className="text-8xl">the</span> Flag</h1>
                <p className="text-center text-lg mt-[-3%]">Capture the Flag by solving challenges to find hidden flags.</p>
            </div>

        </section>
    )
}

export default CaptureTheFlag;
