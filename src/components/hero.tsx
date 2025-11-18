import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <div className="md:w-[48%]">
        <h1 className="md:text-5xl font-semibold">
          Manage your Final Year Projects Seamlessly
        </h1>
        <p className="text-xl mt-4 md:pr-15">
          Streamline submissions, track feedback and collaborate with
          supervisors and peers. Making your final year project a success.
        </p>

        <div className="flex gap-2 mt-4">
          <Link
            to="/auth/students"
            className="bg-green-700 px-2 py-1 rounded-[5px] text-white cursor-pointer"
          >
            Sign up as Student
          </Link>
          <Link
            to="/auth/supervisors"
            className="border-green-700 border-2 bg-white px-2 py-1 rounded-[5px] text-green-900 cursor-pointer"
          >
            Sign up as Supervisor
          </Link>
        </div>
      </div>

      <img
        src="https://res.cloudinary.com/dcw1m1rak/image/upload/v1762958834/download_z5bfuq.jpg"
        alt=""
        className="md:w-[40%] md:h-[70vh] rounded-md"
      />
    </section>
  );
};

export default Hero;
