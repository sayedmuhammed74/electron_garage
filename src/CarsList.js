import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const CarsList = () => {
  const inputSerach = useRef(0);
  const [inputValue, setInputValue] = useState('');
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:5000/cars')
      .then((res) => {
        setCars(res.data.reverse());
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setFilteredCars(cars);
  }, [cars]);

  useEffect(() => {
    const filter = cars.filter((car) =>
      car[1].toLowerCase().includes(inputValue)
    );
    setFilteredCars(filter);
  }, [inputValue, cars]);

  return (
    <section className="ml-16 mt-16 px-5 py-3 rounded-xl shadow-md mr-5 bg-white">
      <div className="flex justify-between">
        <h1 className="font-semibold ml-5 text-xl my-5">Cars Stack</h1>
        <input
          className="bg-gray-50 px-4 w-1/2 mr-5 py-2 border-0 border-b-2 my-3 rounded-lg"
          type="search"
          placeholder="search"
          ref={inputSerach}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div>
        <ul className="flex flex-col space-y-4">
          <li className="flex justify-between font-semibold">
            <span className="text-left">License</span>
            <span className="text-left">Date</span>
            <span className="text-left">Actions</span>
          </li>
          {filteredCars.length === 0 && (
            <h1 className="font-semibold text-center text-xl my-3 text-slate-900">
              No Cars in Stack
            </h1>
          )}
          {filteredCars.map((car) => (
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
  );
};

export default CarsList;
