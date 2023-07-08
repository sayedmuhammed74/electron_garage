import { useState } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
// components
import CarsList from './CarsList';
import AddCar from './AddCar';
import UpdateCar from './UpdateCar';
import Delete from './Delete';
import Dashboard from './Dashboard';
import History from './History';
// icons
import { AiOutlineHistory } from 'react-icons/ai';
import { LuLayoutDashboard } from 'react-icons/lu';
import { IoCarSportSharp } from 'react-icons/io5';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { MdCleaningServices } from 'react-icons/md';
import Analytics from './Analytics';
import Services from './Services';

// refs
function App() {
  const [active, setActive] = useState('dashboard');

  const handleActive = (name) => {
    setActive(name);
  };

  return (
    <HashRouter>
      <div className="container mx-auto flex space-x-5">
        {/* side bar */}
        <section className="fixed mr-20 flex mt-36 rounded-lg h-[50vh] justify-center items-center w-12 bg-white">
          <ul className="flex flex-col gap-5 items-center px-2 py-5 text-[#1e1e1b]">
            <li className="text-4xl">
              <Link to="/">
                <LuLayoutDashboard
                  onClick={() => setActive('dashboard')}
                  className={`cursor-pointer p-0.5 rounded-md border-2 ease-in ${
                    active === 'dashboard'
                      ? 'text-blue-500 border-blue-500'
                      : ''
                  }`}
                />
              </Link>
            </li>
            <li className="text-4xl">
              <Link to="/cars">
                <IoCarSportSharp
                  onClick={() => setActive('cars')}
                  className={`cursor-pointer p-0.5 rounded-md border-2 ease-in ${
                    active === 'cars' ? 'text-blue-500 border-blue-500' : ''
                  }`}
                />
              </Link>
            </li>
            <li className="text-4xl">
              <Link to="/history">
                <AiOutlineHistory
                  onClick={() => setActive('history')}
                  className={`cursor-pointer p-0.5 rounded-md border-2 ease-in ${
                    active === 'history' ? 'text-blue-500 border-blue-500' : ''
                  }`}
                />
              </Link>
            </li>
            <li className="text-4xl">
              <Link to="/analytics">
                <IoAnalyticsOutline
                  onClick={() => setActive('analytics')}
                  className={`cursor-pointer p-0.5 rounded-md border-2 ease-in ${
                    active === 'analytics'
                      ? 'text-blue-500 border-blue-500'
                      : ''
                  }`}
                />
              </Link>
            </li>
            <li className="text-4xl">
              <Link to="/services">
                <MdCleaningServices
                  onClick={() => setActive('services')}
                  className={`cursor-pointer p-0.5 rounded-md border-2 ease-in ${
                    active === 'services' ? 'text-blue-500 border-blue-500' : ''
                  }`}
                />
              </Link>
            </li>
          </ul>
        </section>
        <div className="w-[90%]">
          <Routes>
            <Route
              path="/"
              element={<Dashboard handleActive={handleActive} />}
            />
            <Route
              path="/cars"
              element={<CarsList handleActive={handleActive} />}
            />
            <Route path="/history" element={<History />} />
            <Route
              path="/add"
              element={<AddCar handleActive={handleActive} />}
            />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/update/:id"
              element={<UpdateCar handleActive={handleActive} />}
            />
            <Route
              path="/delete/:id"
              element={<Delete handleActive={handleActive} />}
            />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
