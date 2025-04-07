<div className="h-screen flex items-end justify-end">
<button
  className="fixed lg:hidden z-90 bottom-10 right-10 bg-[#191c21] w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-[#191c21] duration-300"
  onClick={toggleSidebar}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M2.25 4.5A.75.75 0 0 1 3 3.75h14.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm14.47 3.97a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 1 1-1.06 1.06L18 10.81V21a.75.75 0 0 1-1.5 0V10.81l-2.47 2.47a.75.75 0 1 1-1.06-1.06l3.75-3.75ZM2.25 9A.75.75 0 0 1 3 8.25h9.75a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 9Zm0 4.5a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </svg>
</button>

<div
  className={` ${
    open ? "w-0" : "w-16"
  } lg:w-[17rem] flex flex-col  justify-between bg-[#191c21] h-screen relative duration-500`}
>
  <ul className="pt-0 mx-3 lg:hidden xl:block ">
    <div className="justify-center mt-5 mb-6">
      <div
        className={`text-white font-medium text-sm px-2 duration-200 ${
          open && "invisible lg:visible"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-[#b5bbc516] h-10 w-10 rounded-lg border-[#90959e96] border">
            <img src={logoboth} alt="" className="p-1" />
          </div>
          <h1 className="text-[1.1rem]">TransitIQ</h1>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2 mx-2 bg-[#b5bbc516] px-3 py-[5px] rounded-md border-[#90959e96] border">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#b5bbc5"
          className="size-5"
        >
          <path
            fillRule="#b5bbc5"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-[#b5bbc5] text-[0.8rem]"
        />
      </div>
    </div>
    {Menus.map((Menu, index) => (
      <div key={index}>
        <li
          className={`flex rounded-md p-2 px-4 cursor-pointer hover:bg-[#262a30] text-[#b5bbc5] text-[0.875rem] items-center gap-x-4 transition-all duration-1000 ${
            Menu.gap ? "mb-12" : "mt-2"
          }`}
          onClick={() => Menu.subMenu && setSubMenuOpen(!subMenuOpen)}
        >
          {Menu.icon}
          <span className={`flex-1 transition-all duration-1000`}>
            {Menu.title}
          </span>

          {Menu.subMenu && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`size-4 ${
                subMenuOpen && "rotate-180 duration-500"
              }`}
            >
              <path
                fillRule="evenodd"
                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </li>

        {Menu.gap && <hr className="border-t border-gray-600 my-2" />}

        {Menu.subMenu && subMenuOpen && open && (
          <ul
            className={`overflow-hidden transition-all duration-500 ease-out transform ${
              subMenuOpen
                ? "max-h-40 opacity-100 scale-100"
                : "max-h-0 opacity-0 scale-95"
            }`}
          >
            {Menu.subMenu.map((subMenuItem, idx) => (
              <li
                key={idx}
                className="flex px-11 cursor-pointer text-center text-sm text-gray-200 py-1 transition-all duration-[2000ms] ease-out hover:text-gray-300"
              >
                {subMenuItem.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </ul>

  <div className="flex items-center space-x-2 mx-6 mb-5 mt-2 bg-[#b5bbc516] px-3 py-[5px] rounded-md border-[#90959e96] border">
    <div className="h-8 w-8">
      <img src={users} alt="" className="w-full rounded-full" />
    </div>
    <div className="text-[#b5bbc5] text-[0.7rem]">
      <p className="font-medium">Silva front-end</p>
      <p className="text-[#b5bbc5a4]">Silvafrontend@gmail.com</p>
    </div>
  </div>
</div>
</div>















{menu.gap && <hr className="border-t border-gray-600 my-3" />}