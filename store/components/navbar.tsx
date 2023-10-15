"use client";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3001/api/v1/vendors");
        if (response.ok) {
          const vendorsData = await response.json();
          setVendors(vendorsData);
        } else {
          console.log("Error while fetching vendors.");
        }
      } catch (error) {
        console.log("Error while fetching vendors: " + error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-8">
        <StoreSwitcher items={vendors.vendors} />
        <MainNav className="mx-8 lg:mx-16 xl:mx-32" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
