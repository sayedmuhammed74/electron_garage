import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddCar = ({ handleActive }) => {
  const img = useRef(0);
  const navigate = useNavigate();
  const [imgPath, setImgPath] = useState('');

  useEffect(() => {
    handleActive('');
  }, []);

  const detectFromImage = () => {
    const imgName = imgPath.split('\\')[2];
    if (imgName) {
      axios.post('http://localhost:5000/img', { imgName }).then(async (res) => {
        await res.data;
        navigate('/');
      });
    }
  };

  const detectFromCamera = async () => {
    await axios.get('http://localhost:5000/cam').then(async (res) => {
      await res.data;
      navigate('/');
    });
  };

  return (
    <div className="h-[100vh] flex items-center justify-center">
      <div className="container mx-auto px-6 py-6 flex flex-col items-center gap-5">
        <input
          type="file"
          className="mb-2"
          ref={img}
          value={imgPath}
          onChange={() => setImgPath(img.current.value)}
        />
        <div className="flex gap-10 justify-center items-center">
          <button
            onClick={detectFromImage}
            className="px-5 py-3 rounded-xl bg-red-500 text-white font-medium"
          >
            Browse from Image
          </button>
          <button
            onClick={detectFromCamera}
            className="px-5 py-3 rounded-xl bg-blue-400 text-white font-medium"
          >
            Detect from Camera
          </button>
          <Link
            to="/"
            className="px-12 py-3 rounded-xl bg-gray-400 text-white font-medium"
          >
            Back to Stack
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
