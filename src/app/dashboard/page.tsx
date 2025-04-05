import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

const page = () => {
  return (
    <main>
      <Navbar />
      <div className="flex flex-row">
          <Sidebar/>
      </div>
    </main>
  );
};

export default page;
