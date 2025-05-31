

const bannerImg = "/images/banner.png"

const Banner = () => {
    return (
        <div className="w-full">
        <img 
            alt="banner"
            src={bannerImg}
            className="w-full h-auto object-cover aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] lg:aspect-[16/3] xl:aspect-[16/2.5]"
        />
        </div>
    );
};


export default Banner;
