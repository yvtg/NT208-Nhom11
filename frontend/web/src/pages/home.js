import StartNavbar from "../components/StartNavbar";
import Banner from "../components/Banner";
import CategoryCard from "../components/CategoryCard";
import ChatIcon from "../components/ChatIcon";
import Footer from "../components/Footer";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";

const categories = [
    { title: "Video & Animation", imgSrc: "/images/video.png" },
    { title: "Graphic & Design", imgSrc: "/images/design.png" },
    { title: "Programming & Tech", imgSrc: "/images/tech.png" },
    { title: "Digital Marketing", imgSrc: "/images/marketing.png" },
    { title: "Writing & Translation", imgSrc: "/images/writing.png" },
    { title: "Music & Audio", imgSrc: "/images/music.png" },
];

const Home = () => {

    const navigate = useNavigate();

    return (
        <div>
            <StartNavbar className="fixed"/>
            <Banner className="mt-[50px]"/>
            <div className="text-center mt-10 mb-6">
                <p>Don't have an account? Click this <PrimaryButton onClick={() => navigate("/signup")}>Button</PrimaryButton> to create one</p>
            </div>

            <div className="flex gap-5 overflow-x-auto whitespace-nowrap scrollbar-hide p-4 justify-center">
                {categories.map((cat, index) => (
                    <div key={index} className="min-w-[250px] p-4 rounded-lg">
                    <CategoryCard title={cat.title} imgSrc={cat.imgSrc} />
                    </div>
                ))}
            </div>
            <div>
                <ChatIcon/>
                <Footer />
            </div>
        </div>
    );
};

export default Home;
