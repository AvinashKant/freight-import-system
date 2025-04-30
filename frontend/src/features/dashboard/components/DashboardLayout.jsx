import React, { useState } from "react";

const DashboardLayout = ({ children }) => {
  const agentNames = ["John", "Alice", "Bob"];
  const [selectedName, setSelectedName] = useState(agentNames[0]);

  return (
    <div className="flex flex-col min-h-screen bg-[#dfdfd7]">
      <header className="py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-normal">Hello, {selectedName}!</div>
        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="w-[100px] p-2 text-[#1E1E1E] bg-[#f5f5f5] border border-[#B3B3B3] rounded-lg"
        >
          <option disabled>--Select--</option>
          {agentNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </header>
      <main className="flex-1 p-6 bg-[#dfdfd7]">{children}</main>
    </div>
  );
};

export default DashboardLayout;
