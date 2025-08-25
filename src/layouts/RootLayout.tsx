import { Outlet } from "react-router";
import Header from "../components/Header";

const RootLayout = () => {
    return (
        <div className="max-w-2xl mx-auto p-8">
            <Header />
            <Outlet />
        </div>
    );
};

export default RootLayout;
