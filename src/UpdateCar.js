import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UpdateCar = () => {
  const navigate = useNavigate();
  const [licence, setLicence] = useState('');
  const [time, setTime] = useState('');
  const href = window.location.href.split('/');
  const id = href[href.length - 1];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/update/${id}`)
      .then(async (res) => {
        await res.data;
        setLicence(res.data[0][1]);
        setTime(res.data[0][2]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = () => {
    axios
      .post(`http://localhost:5000/update/${id}`, { licence, time })
      .then(async (res) => {
        await res.data;
        navigate('/');
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="h-[100vh] flex justify-center items-center container mx-auto">
      <div className="px-6 py-6 flex flex-col gap-4 bg-gray-200 rounded-2xl shadow-md">
        <h1 className="text-center text-2xl font-medium text-slate-900">
          Update Car
        </h1>
        <input
          placeholder="Licence"
          value={licence}
          onChange={(e) => setLicence(e.target.value)}
          className="px-3 py-2 text-lg focus:outline-none rounded-xl text-slate-900"
        />
        <input
          placeholder="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="px-3 py-2 text-lg focus:outline-none rounded-xl text-slate-900"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-xl flex justify-center items-center bg-blue-400"
        >
          Update
        </button>
        <Link
          to="/"
          className="px-4 py-2 rounded-xl flex justify-center items-center bg-gray-400"
        >
          Back
        </Link>
      </div>
    </section>
  );
};

export default UpdateCar;
