import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollResetter = (): JSX.Element => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        return () => {};
    }, [pathname]);
    
    return <></>;
};