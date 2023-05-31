import "./Charts.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FileBox from "../components/FileBox";

const Charts = () => {
    return (
        <div className="page_charts">
            <Navbar />
            <Sidebar />
            <div className="chartscontext d-flex flex-column align-items-start">
                <FileBox />
            </div>
        </div>
    );
};

export default Charts;
