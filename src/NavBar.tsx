import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "./components/ui/Display";
import { useToggleLocalStorage } from "./hooks/hooks";

export const NavBar = (): JSX.Element => {
    const themes = ["light", "dark"];

    return (
        <header className="w-full h-24">
            <nav className="w-full h-full flex justify-center items-center">
                <h1 className="text-3xl text-highlight font-heading fixed z-10">
                    <Link to="/">
                        {"{"}Krypto.{"}"}
                    </Link>
                </h1>
            </nav>
            <div onClick={() => useToggleLocalStorage("theme", themes)}>
                    Flick
                </div>
        </header>
    );
};