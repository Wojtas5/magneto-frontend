import './Home.css'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const Home = () => {
    return (
        <div className="home">
            <Navbar />
            <Sidebar />
        </div>
    )
}

export default Home