import { BadgeCheck, Fingerprint, Package, Store } from "lucide-react";

export default function AllTimeStats({ data }) {
  if (!data) {
    return <div>Error: Data not available.</div>;
  }

  const { vendorId, vendorName, orderStatus, totalCount, products } = data;

  return (
    <div className="text-gray-600 dark:text-gray-300 text-center mt-5 mb-2">
      <h2 className="text-lg font-semibold border-b text-center mt-5 border-t">
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

      {products && products.length > 0 && (
        <div className="border border-gray-500 p-4 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700"
              >
                <div className="text-lg font-semibold">{product.name}</div>
                <div className="bg-blue-400 text-white p-2 rounded-md">
                  Count: {product.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
