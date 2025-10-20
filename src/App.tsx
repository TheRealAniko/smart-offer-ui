import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage";
import OffersPage from "./pages/OffersPage";
import OfferForm from "./components/OfferForm";
import { SettingsPage } from "./pages/SettingsPage";
import { CompanyEditView } from "./components/CompanyEditView";
import RootLayout from "./layouts/RootLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />, // 👈 Layout mit Header
        children: [
            { index: true, element: <HomePage /> }, // /
            { path: "angebote", element: <OffersPage /> }, // /offers
            { path: "angebot/neu", element: <OfferForm /> }, // /offers/new
            { path: "settings/company", element: <SettingsPage /> }, // /settings/company
            { path: "settings/company/edit", element: <CompanyEditView /> }, // /settings/company/edit
        ],
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer />
        </>
    );
}

export default App;
