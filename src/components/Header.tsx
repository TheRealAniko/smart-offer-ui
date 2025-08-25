import { useNavigate, useLocation } from "react-router";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const linkClasses = (path: string) =>
        `text-sm font-medium ${
            location.pathname === path
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
        }`;

    return (
        <header className="flex items-center justify-between mb-8 border-b pb-4">
            <h1
                onClick={() => navigate("/")}
                className="text-2xl font-bold cursor-pointer">
                SmartOffer
            </h1>
            <nav className="flex gap-4">
                <button
                    onClick={() => navigate("/angebot/neu")}
                    className={linkClasses("/angebot/neu")}>
                    Neues Angebot
                </button>
                <button
                    onClick={() => navigate("/angebote")}
                    className={linkClasses("/angebote")}>
                    Angebote
                </button>
            </nav>
        </header>
    );
};

export default Header;
