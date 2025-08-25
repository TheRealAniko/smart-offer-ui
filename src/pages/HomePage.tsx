import { useNavigate } from "react-router";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 text-center">
            <h1 className="text-3xl font-bold">SmartOffer</h1>
            <p className="text-gray-600">Willkommen! Wähle eine Aktion:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Neues Angebot */}
                <div className="border rounded-xl shadow-sm p-6 hover:shadow-md transition">
                    <h2 className="text-xl font-semibold mb-2">
                        Neues Angebot
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Erstelle ein neues Angebot für deine Kunden.
                    </p>
                    <button
                        onClick={() => navigate("/angebot/neu")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Erstellen
                    </button>
                </div>

                {/* Angebote anzeigen */}
                <div className="border rounded-xl shadow-sm p-6 hover:shadow-md transition">
                    <h2 className="text-xl font-semibold mb-2">
                        Angebote anzeigen
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Sieh dir deine gespeicherten Angebote an und bearbeite
                        sie.
                    </p>
                    <button
                        onClick={() => navigate("/angbote")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Anzeigen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
