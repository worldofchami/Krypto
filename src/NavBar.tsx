import { Link } from "react-router-dom";
import { SectionHeading } from "./components/ui/Display";

export const NavBar = (): JSX.Element => {
    return (
        <header className="w-full h-24">
            <nav className="w-full h-full flex justify-center items-center">
                <h1 className="text-3xl text-highlight font-heading">
                    <Link to="/">
                        {"{"}Krypto.{"}"}
                    </Link>
                </h1>
            </nav>
        </header>
    );
};