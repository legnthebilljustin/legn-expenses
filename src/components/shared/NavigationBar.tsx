import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import { capitalizeString } from "@/utils/misc";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { clearUser } from "@/state/authSlice";

const menuItems = [
    "dashboard", "expenses", "crypto", "cards", "logout"
] as const;

type NavigationItem = typeof menuItems[number]

export default function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { uid } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    if (!uid) {
        return ""
    }

    const handleRouteNav = (item: NavigationItem) => {
        if (item === "logout") {
            return handleLogout()
        }

        navigate(`/${item}`)
    }

    const handleLogout = () => {
        signOut(auth)
        dispatch(clearUser())
        
        setTimeout(() => {
            navigate("/login", { replace: true })
        }, 2000)
    }

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                <p className="font-bold text-inherit">LEGN</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {menuItems.map((item: NavigationItem, index: number) => (
                    <NavbarItem key={index}>
                        <div className="cursor-pointer" onClick={() => handleRouteNav(item)}>{ capitalizeString(item) }</div>
                        
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item: NavigationItem, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                    <div className="cursor-pointer" onClick={() => handleRouteNav(item)}>{ capitalizeString(item) }</div>
                </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
