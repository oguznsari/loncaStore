export default function StatsCard({ products }) {
  if (!products) {
    return <div>Error: Data not available.</div>;
  }

  return (
    <div className="mx-auto w-full mb-4">
      <div className="border border-gray-500 p-4 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
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
    </div>
  );
}
