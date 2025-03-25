import Searchbar from "./Searchbar";

const bannerImg = "/images/banner.png"

const Banner = () => {
    return (
        <div>
            <img alt="banner" src={bannerImg} className="w-full h-70"/>
            <Searchbar className="drop-shadow-md w-[50vw] mt-[-24px] bg-white"/>
        </div>
    );
};

export default Banner;
