import axios from 'axios';
import { useEffect, useState } from 'react';

const History = () => {
  const [cars, setCars] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:5000/history')
      .then((res) => {
        setCars(res.data.reverse());
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="ml-16 px-5 py-3 mt-16 rounded-xl shadow-md mx-5 bg-white">
      <h1 className="font-semibold ml-5 text-xl my-5">History</h1>
      <div>
        <ul className="flex flex-col space-y-4">
          <li className="flex justify-between font-semibold">
            <span className="w-1/4 text-left">License</span>
            <span className="w-1/4 text-left">Enter Date</span>
            <span className="w-1/4 text-left">Out Date</span>
            <span className="w-1/4 text-left">Price</span>
          </li>
          <ul className="flex flex-col space-y-4 max-h-[70vh] overflow-y-scroll pb-1">
            {/* in case no cars */}
            {cars.length === 0 && (
              <h1 className="font-semibold text-center text-xl my-3 text-slate-900">
                No Cars in Stack
              </h1>
            )}

            {cars.map((car) => (
              <li key={car[0]} className="flex justify-between items-center">
                <span className="w-1/4 text-lg font-medium text-gray-800">
                  {car[1]}
                </span>
                <span className="w-1/4 text-lg font-medium text-gray-800">
                  {car[2]}
                </span>
                <span className="w-1/4 text-lg font-medium text-gray-800">
                  {car[3]}
                </span>
                <span className="w-1/4 text-lg font-medium text-gray-800">
                  {car[4]}$
                </span>
              </li>
            ))}
          </ul>
        </ul>
      </div>
    </section>
  );
};

export default History;
