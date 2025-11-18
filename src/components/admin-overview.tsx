import { useEffect, useState } from "react";
import { Users, GraduationCap, FolderKanban } from "lucide-react";

const overviewData = [
  {
    label: "Supervisors",
    value: 230,
    icon: Users,
    bg: "bg-blue-100 dark:bg-blue-900",
    circleBg: "bg-blue-200 dark:bg-blue-800",
  },
  {
    label: "Students",
    value: 2300,
    icon: GraduationCap,
    bg: "bg-green-100 dark:bg-green-900",
    circleBg: "bg-green-200 dark:bg-green-800",
  },
  {
    label: "Projects",
    value: 2300,
    icon: FolderKanban,
    bg: "bg-yellow-100 dark:bg-yellow-900",
    circleBg: "bg-yellow-200 dark:bg-yellow-800",
  },
];

const AnimatedNumber = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

const Overview = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {overviewData.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className={`
              ${item.bg}
              shadow-md rounded-lg p-6 flex flex-col items-center justify-center 
              transition transform hover:-translate-y-1 hover:shadow-xl 
              dark:shadow-none dark:text-white
            `}
          >
            {/* icon + number horizontally aligned */}
            <div className="flex items-center gap-3 mb-1">
              {/* circular icon background */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${item.circleBg}`}
              >
                <Icon
                  size={26}
                  className="text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* animated number */}
              <span className="text-gray-900 dark:text-gray-200 font-bold text-3xl">
                <AnimatedNumber target={item.value} />
              </span>
            </div>

            {/* label */}
            <span className="text-gray-900 dark:text-gray-300 font-semibold text-lg mt-1">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Overview;
