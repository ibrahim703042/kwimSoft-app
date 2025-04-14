import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import profile from "../../assets/img/users/avatar.png";
import { useUserData } from "../../hooks/useUserData";
import { profileMenu } from "@/constants";

const UserInfo: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useUserData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const menus = profileMenu(t);

  const handleClick = (key: string) => {
    setOpen(false);
    if (key === "signOut") {
      console.log("Logging out...");
    } else {
      console.log(`Navigate to: ${key}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <img
          src={profile}
          alt="User"
          className="h-8 w-8 rounded-full border border-gray-300 shadow-sm"
        />
        <div className="hidden sm:block text-left text-xs text-gray-700 dark:text-gray-200">
          <p className="font-medium text-[0.7rem] leading-tight">
            {data?.fullName || "Loading..."}
          </p>
          <p className="text-[0.7rem] leading-tight">
            {data?.email || "user@example.com"}
          </p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-800 z-50">
          {menus.map((item) => (
            <button
              key={item.key}
              onClick={() => handleClick(item.key)}
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
