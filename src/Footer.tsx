import { Link } from "react-router-dom";

export const Footer = (): JSX.Element => {
    return (
        <>
            <footer className="w-full h-24 flex flex-col items-center justify-evenly mt-16 text-xs font-heading">
                <div className="h-8 w-16 gap-x-4 flex">
                    <div className="h-full w-1/2 opacity-80 hover:opacity-100">
                        <Link to="https://github.com/worldofchami" target="_blank">
                            <img src="/public/github.png" alt="My GitHub" />
                        </Link>
                    </div>
                    <div className="h-full w-1/2 opacity-80 hover:opacity-100">
                        <Link to="https://www.linkedin.com/in/tino-chaminuka-803b8622b/" target="_blank">
                            <img src="/public/linkedin.png" alt="My LinkedIn" />
                        </Link>
                    </div>
                </div>
                <span className="text-center">{"{ Krypto } - A passion project by Tino Chaminuka. Built with React and Express."}</span>

            </footer>
        </>
    )
};