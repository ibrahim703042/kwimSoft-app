const HeaderBox = ({ type = "title", title, subtext }: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === "greeting"}
      </h1>
      <p className="header-box-subtext ">{subtext}</p>
    </div>
  );
};

export default HeaderBox;
