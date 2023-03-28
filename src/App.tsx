import { useRoutes } from "react-router-dom";
import { Index } from "./Index";

const App = (): (React.ReactElement | null) => {
    const routes: (React.ReactElement | null) = useRoutes([
        {
            path: '/',
            element: <Index />,
        },
        {

        },
    ]);

    return routes;
};

export default App;