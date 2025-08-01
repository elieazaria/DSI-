import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Assurez-vous d'utiliser "react-router-dom"
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Produits from "./pages/Forms/Produits";
import Sorties from "./pages/Equivalence/Sorties";
import Demandes from "./pages/Equivalence/Demandes"
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Demand from "./pages/AuthPages/Demand";
import MaterialRequestForm from "./components/equivalence/DemandeMateriel";
import MaterialRequestList from "./components/equivalence/ListeDemand";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Définir SignIn comme page d'accueil */}
          <Route path="/" element={<SignIn />} />

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} /> {/* Vous pouvez garder cette route si vous voulez une URL explicite pour le signin */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/demand" element={<Demand />} />

          {/* Dashboard Layout - Ces routes seront accessibles après la connexion */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} /> {/* La page d'accueil réelle après connexion */}
            <Route path="/demandeliste" element={<Demandes />} />
            <Route path="/demande" element={<MaterialRequestForm />} />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/sorties" element={<Sorties />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}