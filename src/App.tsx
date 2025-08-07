import "./index.css";
import OfferForm from "./components/OfferForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">
                SmartOffer Formular
            </h1>
            <OfferForm />
            <ToastContainer />
        </main>
    );
}

export default App;
