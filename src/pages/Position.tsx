import "./Position.css";
import Navbar from "../components/Navbar";
import PositionChart from "../components/PositionChart";
import Sidebar from "../components/Sidebar";

const Position = () => {
    return (
        <div className="poscharts">
            <Navbar />
            <Sidebar />
            <div className="poschartcontext d-flex flex-column align-items-start">
                <PositionChart />
            </div>
        </div>
    );
};

export default Position;
