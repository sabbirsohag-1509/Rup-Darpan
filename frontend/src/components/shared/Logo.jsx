const Logo = ({ compact = false }) => {
  return (
    <div className="font-serif flex items-center border border-4 p-2 rounded-sm ">
      <h1
        className={`font-bold leading-tight tracking-tight ${
          compact ? "text-xl md:text-2xl" : "text-xl md:text-2xl lg:text-3xl"
        }`}
      >
        <span className="text-[#C4121A] font-bold">RUP</span>
        <span className="text-base-content font-bold ml-2">DARPON</span>
      </h1>
    </div>
  );
};

export default Logo;
