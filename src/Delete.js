import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Delete = ({ handleActive }) => {
  const href = window.location.href.split('/');
  const id = href[href.length - 1];
  const navigate = useNavigate();
  const [car, setCar] = useState([[]]);
  const [time, setTime] = useState('');

  useEffect(() => {
    handleActive('');
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/checkout/${id}`)
      .then(async (res) => {
        await setCar(res.data);
        setTime((new Date() - new Date(res.data[0][2])) / 1000 / 3600);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const checkout = () => {
    axios
      .post(`http://localhost:5000/delete/${id}`, {
        license: car[0][1],
        in_time: car[0][2],
      })
      .then(async (res) => {
        await res.data;
        await navigate('/');
        console.log('deleted');
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="h-[100vh] flex justify-center items-center container mx-auto">
      <div className="w-[400px] px-6 py-6 flex flex-col gap-4 bg-gray-200 rounded-2xl shadow-md">
        <h1 className="text-center text-2xl font-medium text-slate-900">
          Bill
        </h1>
        <p className="text-lg font-medium text-slate-900">
          License: <span>{car[0][1] ? car[0][1] : ''}</span>
        </p>
        <p className="text-lg font-medium text-slate-900">
          Total Time:{' '}
          <span>
            {time
              ? (Math.floor(time) ? Math.floor(time) + ' Hours ' : '') +
                (Math.round((time % Math.floor(time)) * 60)
                  ? Math.round((time % Math.floor(time)) * 60) + ' mins'
                  : '5 mins')
              : ''}
          </span>
        </p>
        <p className="text-lg font-medium text-slate-900">
          Price: <span>{time ? (time * 0.5).toFixed(2) : ''}$</span>
        </p>
        <div className="flex gap-5 justify-around items-center font-medium text-lg text-white">
          <Link
            to="/"
            className="px-4 py-2 w-[40%] rounded-xl flex justify-center items-center bg-red-400"
          >
            Back
          </Link>
          <button
            onClick={checkout}
            className="px-4 w-[40%] py-2 rounded-xl flex justify-center items-center bg-blue-400"
          >
            checkout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Delete;
