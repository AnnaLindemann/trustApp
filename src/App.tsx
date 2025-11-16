import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

import Intro from "./routes/Intro";
import AddChild from "./routes/AddChild";
import Trust from "./routes/Trust";
import Repair from "./routes/Repair";
import EditChild from "./routes/EditChild";
import { useAppStore } from "./stores/useAppStore";
import InstallBanner from "./components/InstallBanner";

function RootRedirect() {
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding,
  );

  if (hasCompletedOnboarding) {
    return <Navigate to="/trust" replace />;
  }

  return <Navigate to="/intro" replace />;
}

export default function App() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto max-w-xl p-4">
        <Header />

        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/children/new" element={<AddChild />} />
          <Route path="/children/:id/edit" element={<EditChild />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <InstallBanner />
    </div>
  );
}
