// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

import Intro from "./routes/Intro";
import AddChild from "./routes/AddChild";
import Trust from "./routes/Trust";
import Repair from "./routes/Repair";

export default function App() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto max-w-xl p-4">
        <Header />

        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/children/new" element={<AddChild />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
