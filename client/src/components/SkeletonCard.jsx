import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCard = () => {
  return (
    <div className="bg-white shadow-md rounded p-4">
      <Skeleton height={192} className="mb-4 rounded-t" />
      <Skeleton height={24} className="mb-2" />
      <Skeleton height={20} width="75%" className="mb-2" />
      <Skeleton height={20} width="50%" />
    </div>
  );
};

export default SkeletonCard;
