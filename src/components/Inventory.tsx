import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Package } from "lucide-react";

export default function ItemDisplay() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch items
  useEffect(() => {
    axios
      .get("https://sheetdb.io/api/v1/64y33c32syqox")
      .then((res) => {
        setItems(res.data || []);
      })
      .catch((err) => console.error("Fetch error:", err.message));
  }, []);

  // Filter + Sort safely
  const filteredItems = items
    .filter((item) =>
      item?.COMPONENTS?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      (a.COMPONENTS || "")
        .toLowerCase()
        .localeCompare((b.COMPONENTS || "").toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <h2 className="text-3xl font-bold text-center text-[#003366] mb-8">
        Inventory Components
      </h2>

      {/* Search */}
      <div className="flex justify-center mb-10 px-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search components..."
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-[#003366] 
          transition-all duration-300"
        />
      </div>

      {/* Grid */}
      <div
        ref={scrollRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto"
      >
        {filteredItems.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md 
            hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
            transition-all duration-300 ease-out 
            p-8 flex flex-col items-center border border-gray-100"
          >
            <div className="bg-[#003366]/10 p-4 rounded-full mb-4">
              <Package size={40} className="text-[#003366]" />
            </div>

            <h3 className="text-lg font-semibold text-[#003366] text-center">
              {item.COMPONENTS}
            </h3>

            <p className="text-sm text-gray-700 mt-3">
              Quantity:{" "}
              <span className="font-medium text-[#003366]">
                {item.QUANTITY}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}