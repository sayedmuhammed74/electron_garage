const Services = () => {
  return (
    <section className="ml-16 mt-14">
      <h1 className="font-semibold ml-5 text-3xl my-5 text-slate-900">
        Services
      </h1>

      {/* numbers cards */}
      <div className="flex justify-around items-center gap-12 text-slate-800"></div>

      {/* Recent Orders */}
      <section className="bg-white px-5 py-3 mt-5 rounded-xl shadow-md mx-5">
        <h1 className="font-semibold ml-5 text-xl my-5">no services yet</h1>
        <div></div>
      </section>
    </section>
  );
};

export default Services;
