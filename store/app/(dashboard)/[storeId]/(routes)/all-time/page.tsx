import AllTimeStats from "@/components/all-time-stats";

export default async function AllTimeSummary({
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
        "http://localhost:3001/api/v1/vendors/" + storeId + "/allTimeStats",
        requestOptions
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

  // Get vendor data and store it in allTimeData
  const allTimeData = await fetchAllTimeData(params.storeId);

  return <AllTimeStats data={allTimeData} />;
}
