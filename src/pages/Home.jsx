import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";

function Home() {
    return (
        <main className="flex flex-col h-screen w-[100%]">
            <div className="flex flex-row">
                <div className="w-[20%] h-screen">
                    <SideBar />
                </div>
                <div className="flex-grow">
                    <TopBar />
                </div>
            </div>
        </main>
    );
}

export default Home;
