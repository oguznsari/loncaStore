import AllTimeStats from "@/components/all-time-stats";
import StatsCard from "@/components/stat-card";
import { Overview } from "@/components/yearly-overview";
import { BadgeCheck, CalendarCheck } from "lucide-react";

export default async function YearlySummary({
  params,
}: {
  params: { storeId: string };
}) {
  // Fetch all time data here
  const fetchAllTimeData = async (storeId) => {
    try {
      var requestOptions = {
        method: "GET", // Use GET method for GET request
        headers: {
          "Content-Type": "application/json",
        },
        // Remove 'body' property for GET request
        redirect: "follow",
      };
      const response = await fetch(
        "http://localhost:3001/api/v1/vendors/" + storeId + "/yearSummary/2022",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("Error while fetching yearly data.");
        return null;
      }
    } catch (error) {
      console.log("Error while fetching yearly data: " + error.message);
      return null;
    }
  };

  // Get vendor data and store it in yearlyData
  const yearlyData = await fetchAllTimeData(params.storeId);

  const chartData = [];

  const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const longMonthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  for (let i = 1; i < 13; i++) {
    const monthData = yearlyData.months[i];
    chartData.push({
      name: shortMonthNames[i - 1],
      tPacks: monthData?.totalPackQty ?? 0,
      tInd: monthData?.totalIndQty ?? 0,
      tRevenue: monthData?.totalRevenue ?? 0,
      total: monthData?.totalPackQty ?? 0,
    });
  }

  let productSummary = {};
  for (let mon in yearlyData.months) {
    if (yearlyData.months.hasOwnProperty(mon)) {
      const monthData = yearlyData.months[mon]["products"];
      productSummary[mon] = [];
      for (let i = 0; i < monthData.length; i++) {
        productSummary[mon].push({
          name: monthData[i].name,
          count: monthData[i].qty,
        });
      }
    }
  }

  return (
    <div className="text-gray-600 dark:text-gray-300 text-center mt-5 mb-2 mx-40">
      <h2 className="text-2xl font-semibold border-b text-center mt-5 border-t">
        Yearly product statistics
      </h2>
      <div className="my-4">
        <div className="flex gap-5 text-center justify-center items-center">
          Vendor Name:
          <span className="flex gap-2 text-blue-500">
            2022
            <CalendarCheck />
          </span>
        </div>
        <div className="flex gap-5 text-center justify-center items-center">
          Order Status:
          <div className="flex gap-2 text-green-500">
            Confirmed
            <BadgeCheck />
          </div>
        </div>
      </div>

      <Overview data={chartData} />
      <h1 className="text-3xl text-center py-2 my-2 bg-gray-100 dark:bg-gray-700 border border-gray-400 p-4 mt-20 border-top dark:border-gray-800 mx-40">
        Per month product purchase summary
      </h1>
      {productSummary &&
        Object.keys(productSummary).map((month) => (
          <div key={month} className="mx-40 my-2">
            <h1 className="text-xl text-center py-2 my-2">
              {longMonthNames[month - 1]}
            </h1>
            <StatsCard products={productSummary[month]} />
          </div>
        ))}
    </div>
  );
}
