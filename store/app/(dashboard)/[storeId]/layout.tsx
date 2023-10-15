import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  // Fetch vendor data here
  const fetchVendorData = async (storeId) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/vendors/" + storeId
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("Error while fetching vendors.");
        return null;
      }
    } catch (error) {
      console.log("Error while fetching vendors: " + error.message);
      return null;
    }
  };

  // Get vendor data and store it in vendorData
  const vendorData = await fetchVendorData(params.storeId);
  return (
    <>
      {vendorData ? (
        <>
          <h1 className="text-4xl -mt-50 border-b mt-10 mb-5">
            Welcome to {vendorData.vendor.name}
          </h1>
          <div className="flex space-x-2 lg:space-x-4 xl:space-x-6">
            <Link
              href={`/${params.storeId}/yearly`}
              className="ml-4 flex lg:ml-0 border border-gray-500"
            >
              <p className="mx-4 my-1 font-light text-l">Yearly Summary</p>
            </Link>
            <Link
              href={`/${params.storeId}/all-time`}
              className="ml-4 flex lg:ml-0 border border-gray-500"
            >
              <p className="mx-4 my-1 font-light text-l">
                All Time Product Summary
              </p>
            </Link>
          </div>
        </>
      ) : (
        <h1 className="text-4xl -mt-50">Welcome to Lonca</h1>
      )}
      {children}
    </>
  );
}
