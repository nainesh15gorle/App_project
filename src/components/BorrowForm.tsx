import React, { useEffect, useMemo, useState } from "react";
import {
  Box, CircularProgress, FormControl, InputAdornment,
  InputLabel, ListSubheader, MenuItem, Select,
  TextField, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const INVENTORY_API = "https://sheetdb.io/api/v1/64y33c32syqox";
// 👇 create a second SheetDB API for the same Google Sheet, pointing to the log tab
const LOG_API = "https://sheetdb.io/api/v1/pdhaclnnjhm9k";

interface InventoryItem {
  COMPONENTS: string;
  QUANTITY: number;
}

const whiteInputSx = {
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputBase-input::placeholder": { color: "white", opacity: 1 },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputLabel-root.Mui-focused": { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "white" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
};

const BorrowReturnForm: React.FC = () => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [components, setComponents] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ===== FETCH INVENTORY ===== */
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(INVENTORY_API);
        const data = await res.json();
        setComponents(
          Array.isArray(data)
            ? data
                .map((i) => ({
                  COMPONENTS: String(i.COMPONENTS ?? "").trim(),
                  QUANTITY: Number(i.QUANTITY),
                }))
                .filter((i) => i.COMPONENTS.length > 0 && Number.isFinite(i.QUANTITY))
            : []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filteredComponents = useMemo(
    () => components.filter((c) =>
      c.COMPONENTS.toLowerCase().includes(searchText.toLowerCase())
    ),
    [components, searchText]
  );

  /* ===== BORROW / RETURN ===== */
  const handleAction = async (type: "Borrow" | "Return") => {
    if (!name || !regNo || !email) return alert("Please fill all user details");
    if (!selectedComponent) return alert("Select a component");
    if (quantity <= 0) return alert("Quantity must be > 0");

    const current = components.find((c) => c.COMPONENTS === selectedComponent);
    if (!current) return alert("Component not found!");

    if (type === "Borrow" && quantity > current.QUANTITY) {
      return alert(`Only ${current.QUANTITY} left in stock!`);
    }

    if (type === "Return" && quantity > (50 - current.QUANTITY)) {
      // optional sanity check — remove if not needed
    }

    setSubmitting(true);

    try {
      const newQty =
        type === "Borrow"
          ? current.QUANTITY - quantity
          : current.QUANTITY + quantity;

      // Step 1 — log the entry
      await fetch(`${LOG_API}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            name,
            registration_number: regNo,
            email,
            component: selectedComponent,
            quantity,
            type,
            date: new Date().toLocaleDateString(),
          },
        }),
      });

      // Step 2 — update inventory quantity
      await fetch(
        `${INVENTORY_API}/COMPONENTS/${encodeURIComponent(selectedComponent)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { QUANTITY: newQty },
          }),
        }
      );

      // Step 3 — update UI
      setComponents((prev) =>
        prev.map((c) =>
          c.COMPONENTS === selectedComponent ? { ...c, QUANTITY: newQty } : c
        )
      );

      alert(`${type} successful!`);

      // reset form
      setName("");
      setRegNo("");
      setEmail("");
      setSelectedComponent("");
      setQuantity(1);

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== UI ===== */
  return (
    <Box className="min-h-screen bg-[#001f42] flex items-center justify-center p-4">
      <Box className="w-full max-w-2xl bg-white/5 rounded-2xl p-6 text-white">
        <Typography variant="h5" color="white" mb={3}>
          Borrow / Return Form
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TextField label="Name" value={name}
            onChange={(e) => setName(e.target.value)} fullWidth sx={whiteInputSx} />
          <TextField label="Reg No" value={regNo}
            onChange={(e) => setRegNo(e.target.value)} fullWidth sx={whiteInputSx} />
        </div>

        <TextField label="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth sx={{ ...whiteInputSx, mb: 3 }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: "white" }}>Select Component</InputLabel>
          <Select
            value={selectedComponent}
            label="Select Component"
            onChange={(e) => setSelectedComponent(e.target.value)}
            onClose={() => setSearchText("")}
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            }}
          >
            <ListSubheader>
              <TextField size="small" placeholder="Search..." fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                sx={whiteInputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </ListSubheader>

            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={18} sx={{ mr: 1 }} /> Loading...
              </MenuItem>
            ) : (
              filteredComponents.map((item) => (
                <MenuItem key={item.COMPONENTS} value={item.COMPONENTS}>
                  {item.COMPONENTS} ({item.QUANTITY} left)
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField label="Quantity" type="number" fullWidth value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          sx={{ ...whiteInputSx, mb: 3 }} />

        <div className="flex gap-4">
          <button onClick={() => handleAction("Borrow")} disabled={submitting}
            className="flex-1 bg-yellow-400 py-3 rounded-lg font-bold text-black disabled:opacity-50">
            {submitting ? "..." : "BORROW"}
          </button>
          <button onClick={() => handleAction("Return")} disabled={submitting}
            className="flex-1 border border-yellow-400 text-yellow-400 py-3 rounded-lg font-bold disabled:opacity-50">
            {submitting ? "..." : "RETURN"}
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default BorrowReturnForm;
