import { BadgeCheck, Fingerprint, Package, Store } from "lucide-react";
import StatsCard from "./stat-card";

export default function AllTimeStats({ data }) {
  if (!data) {
    return <div>Error: Data not available.</div>;
  }

  const { vendorId, vendorName, orderStatus, totalCount, products } = data;

  return (
    <div className="text-gray-600 dark:text-gray-300 text-center mt-5 mb-2 mx-40">
      <h2 className="text-2xl font-semibold border-b text-center mt-5 border-t">
        All-time product statistics
      </h2>
      <div className="my-4">
        <div className="flex gap-5 text-center justify-center items-center">
          Vendor Name:
          <span className="flex gap-2 text-blue-500">
            {vendorName}
            <Store />
          </span>
        </div>
        <div className="flex gap-5 text-center justify-center items-center">
          Vendor ID:
          <span className="flex gap-2 text-amber-300">
            {vendorId}
            <Fingerprint />
          </span>
        </div>

        <div className="flex gap-5 text-center justify-center items-center">
          Order Status:
          <div className="flex gap-2 text-green-500">
            {orderStatus}
            <BadgeCheck />
          </div>
        </div>
        <div className="flex gap-5 text-center justify-center items-center">
          Total Count:
          <span className="flex gap-2 text-orange-400">
            {totalCount}
            <Package />
          </span>
        </div>
      </div>

      <StatsCard products={products} />
    </div>
  );
}
