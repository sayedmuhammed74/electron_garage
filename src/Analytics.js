import { useState } from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Chart, Doughnut } from 'react-chartjs-2';

// ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  //   const [data, setData] = useState([
  //     { sayed: 1 },
  //     { mohamed: 2 },
  //     { ali: 3 },
  //     { abdo: 4 },
  //   ]);
  const [title, setTitle] = useState('Total');
  return (
    <section className="ml-16 mt-14">
      <h1 className="font-semibold ml-5 text-3xl my-5 text-slate-900">
        Analytics
      </h1>

      {/* numbers cards */}
      <div className="flex justify-around items-center gap-12 text-slate-800">
        <div
          onClick={() => setTitle('Last Day')}
          className="w-[23%] flex flex-col gap-2 py-4 rounded-lg justify-center items-center shadow-md bg-white cursor-pointer hover:-translate-y-1 duration-150 ease-in"
        >
          <span className="font-semibold text-2xl">Last Day</span>
        </div>
        <div
          onClick={() => setTitle('Last Week')}
          className="w-[23%] flex flex-col gap-2 py-4 rounded-lg justify-center items-center shadow-md bg-white cursor-pointer hover:-translate-y-1 duration-150 ease-in"
        >
          <span className="font-semibold text-2xl">Last week</span>
        </div>
        <div
          onClick={() => setTitle('Last Month')}
          className="w-[23%] flex flex-col gap-2 py-4 rounded-lg justify-center items-center shadow-md bg-white cursor-pointer hover:-translate-y-1 duration-150 ease-in"
        >
          <span className="font-semibold text-2xl">Last Month</span>
        </div>
        <div
          onClick={() => setTitle('Total')}
          className="w-[23%] flex flex-col gap-2 py-4 rounded-lg justify-center items-center shadow-md bg-white cursor-pointer hover:-translate-y-1 duration-150 ease-in"
        >
          <span className="font-semibold text-2xl">Total</span>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="bg-white px-5 py-3 mt-5 rounded-xl shadow-md mx-5">
        <h1 className="font-semibold ml-5 text-xl my-5">{title}</h1>
        <div></div>
      </section>
    </section>
  );
};

export default Analytics;
