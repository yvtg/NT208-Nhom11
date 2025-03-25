const CategoryCard = ({ title, imgSrc }) => {
    return (
        <div className="text-center">
            <img src={imgSrc} alt={title} className="w-40 h-40 rounded-lg mx-auto" />
            <h3 className="font-semibold mt-2">{title}</h3>
        </div>
    );
};

export default CategoryCard;
