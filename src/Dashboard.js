import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ handleActive }) => {
  const [cars, setCars] = useState([]);
  const [recentCars, setRecentCars] = useState([]);
  const [history, setHistory] = useState([]);
  const [price, setPrice] = useState(0);
  const [dayOrders, setDayOrders] = useState(0);
  useEffect(() => {
    handleActive('dashboard');
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/cars')
      .then((res) => {
        setCars(res.data.reverse());
        setRecentCars(sortFunction(res.data).slice(0, 5));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:5000/history')
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setPrice(0);
    history.map((car) =>
      setPrice((price) => parseFloat(price) + parseFloat(car[4]))
    );
    setPrice((price) => price.toFixed(2));
  }, [history]);

  useEffect(() => {
    setDayOrders(0);
    const todayDate = new Date();
    const day = parseInt(todayDate.toLocaleString().split('/')[1]);
    const month = parseInt(todayDate.toLocaleString().split('/')[0]);
    cars.map((car) => {
      const carDay = parseInt(car[2].slice(3, 5));
      const carMonth = parseInt(car[2].slice(0, 2));
      if (carDay === day && carMonth === month) {
        setDayOrders((prev) => prev + 1);
      }
      return 0;
    });
  }, [cars]);

  const sortFunction = (arr) => {
    arr
      .sort((a, b) => {
        const nameA = a[2].toUpperCase();
        const nameB = b[2].toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      })
      .reverse();
    return arr;
  };

  return (
    <section className="ml-10 mt-14">
      <h1 className="font-semibold ml-5 text-3xl my-5 text-slate-900">
        Dashboard
      </h1>

      {/* numbers cards */}
      <div className="flex justify-around items-center gap-12">
        <div className="w-[27%] flex flex-col gap-2 py-3 rounded-lg justify-center items-center shadow-md bg-white hover:-translate-y-1 duration-150 ease-in">
          <span className="font-bold text-3xl">{cars.length}</span>
          <span className="font-medium text-lg">Cars</span>
        </div>
        <div className="w-[27%] flex flex-col gap-2 py-3 rounded-lg justify-center items-center shadow-md bg-white hover:-translate-y-1 duration-150 ease-in">
          <span className="font-bold text-3xl">{dayOrders}</span>
          <span className="font-medium text-lg">Day Orders</span>
        </div>
        <div className="w-[27%] flex flex-col gap-2 py-3 rounded-lg justify-center items-center shadow-md bg-white hover:-translate-y-1 duration-150 ease-in">
          <span className="font-bold text-3xl">${price}</span>
          <span className="font-medium text-lg">Total Sales</span>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="bg-white px-5 py-3 mt-5 rounded-xl shadow-md mx-5">
        <h1 className="font-semibold ml-5 text-xl my-5">Recent Cars</h1>
        <div>
          <ul className="flex flex-col space-y-4">
            <li className="flex justify-between font-semibold">
              <span className="text-left">License</span>
              <span className="text-left">Date</span>
              <span className="text-left"></span>
            </li>
            {cars.length === 0 && (
              <h1 className="font-semibold text-center text-xl my-3 text-slate-900">
                No Cars in Stack
              </h1>
            )}
            {recentCars.map((car) => (
              <li key={car[0]} className="flex justify-between">
                <span className="w-1/3 lg:w-1/4 text-lg text-start font-medium text-gray-800">
                  {car[1]}
                </span>
                <span className="w-1/3 lg:w-1/4 text-lg font-medium text-start text-gray-800">
                  {car[2]}
                </span>
                <div className="flex gap-3">
                  <Link
                    to={`/update/${car[0]}`}
                    className="rounded-2xl w-24 py-1.5 font-medium text-center bg-blue-400"
                  >
                    Update
                  </Link>
                  <Link
                    to={`/delete/${car[0]}`}
                    className="rounded-2xl w-24 py-1.5 font-medium text-center bg-red-400"
                  >
                    Checkout
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center mt-3 py-2">
          <Link
            to="/add"
            className="px-8 py-2 text-lg text-center rounded-2xl font-semibold mt-2 bg-green-400"
          >
            Add Car
          </Link>
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
