import { ComponentType, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadCrumbItemsAction } from "../../store/actions/appActions";
import { IndentDecrease, LucideIcon, Menu, Group, SquareUser, GitFork, BookUser } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Dispatch } from "redux";
import { useTranslation } from "react-i18next";
import Groupe from "./Groupe";
import Role from "./Role";
import User from "./User";
import UserSession from "./UserSession";
import userRoutes from "../../routes/user/userRoutes";

type Option = {
    name: string;
    component: ComponentType;
    icon: LucideIcon;
};

export default function UserManagement() {
    const dispatch: Dispatch<any> = useDispatch();
    const [openSide, setOpenSide] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<Option>({
        name: "Groupe",
        component: Groupe,
        icon: Group,
    });
    const { t } = useTranslation();
    const linksDown: Option[] = [];
    const handleOpenSide = () => {
        setOpenSide(!openSide);
    };

    const handleOptionSelect = (option: Option) => {
        setSelectedOption(option);
    };

    const linksUp: Option[] = [
        { name: "Groupe", component: Groupe, icon: Group },
        { name: "Roles", component: Role, icon: GitFork },
        { name: "User", component: User, icon: SquareUser },
        { name: "User session", component: UserSession, icon: BookUser },
    ];

    return (
        <div>
            <div className="p-4 bg-white mb-2 rounded-lg shadow-sm md:hidden flex justify-between items-center">
                <p className="text-sm font-medium text-[#1B2559]">User Management</p>
                <button className="p-1 rounded-md bg-gray-200">
                    <Menu size={16} />
                </button>
            </div>

            <div className="flex gap-3 overflow-hidden">
                <div className={`absolute mt-0 ${openSide ? "block" : "hidden"}`}>
                    <div
                        className="border mx-3 bg-white p-1 rotate-180 rounded-b-lg rounded-l-lg cursor-pointer"
                        onClick={handleOpenSide}
                    >
                        <IndentDecrease size={18} />
                    </div>
                </div>
                <div className="sm:block hidden">
                    <div
                        className={`bg-background ${openSide ? "w-0 overflow-hidden" : "w-[290px]"}
                        transition-all duration-200 rounded-2xl flex flex-col shadow-default fixed h-[calc(100vh-50px)]`}
                    >
                        <div className="pl-6 pt-4 flex justify-between items-center">
                            <p className="text-[1rem] text-[#1B2559]">User Management</p>
                            <div
                                className="border p-1 rounded-l-lg cursor-pointer"
                                onClick={handleOpenSide}
                            >
                                <IndentDecrease size={20} />
                            </div>
                        </div>
                        <hr className="my-4" />

                        <div className="sm:block hidden">
                            <div className="flex flex-col overflow-y-auto duration-300 ease-linear h-screen justify-between">
                                <nav className="mt-1 py-2 px-2 lg:mt-1 lg:px-2">
                                    <div>
                                        <ul className="mb-6 flex flex-col gap-1 text-[0.9rem]">
                                            {linksUp.map((link, index) => (
                                                <li key={index}>
                                                    <NavLink
                                                        to={'#'}
                                                        onClick={() => handleOptionSelect(link)}
                                                        className={
                                                            link.name === selectedOption.name
                                                                ? "group relative flex items-center gap-2.5 rounded-md py-1.5 px-2 font-medium text-secondary-foreground duration-300 ease-in-out bg-muted"
                                                                : "group relative flex items-center gap-2.5 rounded-md py-1.5 px-2 font-medium text-muted-foreground hover:text-secondary-foreground duration-300 ease-in-out hover:bg-muted"
                                                        }
                                                    >
                                                        <link.icon size={15} />
                                                        {link.name}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                            <div className="mt-auto pb-2 px-2 lg:px-2">
                                <ul className="flex flex-col gap-1">
                                    {linksDown.map((link, index) => (
                                        <li key={index}>
                                            <NavLink
                                                to={'#'}
                                                onClick={() => handleOptionSelect(link)}
                                                className={
                                                    link.name === selectedOption.name
                                                        ? "group relative flex items-center gap-2.5 rounded-md py-1.5 px-2 font-normal text-secondary-foreground duration-300 ease-in-out bg-muted"
                                                        : "group relative flex items-center gap-2.5 rounded-md py-1.5 px-2 font-normal text-muted-foreground hover:text-secondary-foreground duration-300 ease-in-out hover:bg-muted"
                                                }
                                            >
                                                <link.icon size={15} />
                                                {link.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`w-full ${!openSide ? "ml-[290px]" : "ml-0"} transition-all duration-200`}>
                    <selectedOption.component />
                </div>
            </div>
        </div>
    );
}
