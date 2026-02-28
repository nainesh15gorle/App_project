import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const INVENTORY_API = "https://sheetdb.io/api/v1/64y33c32syqox";
const LOG_API = "https://sheetdb.io/api/v1/pdhaclnnjhm9k";

interface InventoryItem {
  COMPONENTS: string;
  QUANTITY: number;
}

const whiteInputSx = {
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputLabel-root.Mui-focused": { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(255,255,255,0.6)" },
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

  const [popup, setPopup] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

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
                .filter(
                  (i) =>
                    i.COMPONENTS.length > 0 && Number.isFinite(i.QUANTITY)
                )
            : []
        );
      } catch {
        showError("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredComponents = useMemo(() => {
    return components.filter((c) =>
      c.COMPONENTS.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [components, searchText]);

  const showSuccess = (message: string) => {
    setPopup({ open: true, type: "success", message });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, open: false }));
    }, 2500);
  };

  const showError = (message: string) => {
    setPopup({ open: true, type: "error", message });
  };

  const handleAction = async (type: "Borrow" | "Return") => {
    if (!name || !regNo || !email)
      return showError("Please fill all user details");
    if (!selectedComponent)
      return showError("Select a component");
    if (quantity <= 0)
      return showError("Quantity must be greater than 0");

    const current = components.find(
      (c) => c.COMPONENTS === selectedComponent
    );

    if (!current) return showError("Component not found");

    if (type === "Borrow" && quantity > current.QUANTITY)
      return showError(`Only ${current.QUANTITY} left in stock`);

    setSubmitting(true);

    try {
      const newQty =
        type === "Borrow"
          ? current.QUANTITY - quantity
          : current.QUANTITY + quantity;

      const now = new Date();
      const formattedDateTime = `${String(now.getDate()).padStart(2, "0")}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${now.getFullYear()} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      await fetch(LOG_API, {
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
            date: formattedDateTime,
          },
        }),
      });

      await fetch(
        `${INVENTORY_API}/COMPONENTS/${encodeURIComponent(
          selectedComponent
        )}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { QUANTITY: newQty },
          }),
        }
      );

      setComponents((prev) =>
        prev.map((c) =>
          c.COMPONENTS === selectedComponent
            ? { ...c, QUANTITY: newQty }
            : c
        )
      );

      showSuccess(`${type} successful!`);

      setName("");
      setRegNo("");
      setEmail("");
      setSelectedComponent("");
      setQuantity(1);
      setSearchText("");
    } catch {
      showError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-[#001f42] via-[#002b5c] to-[#001933] flex items-center justify-center p-6">
      <Box className="w-full max-w-2xl rounded-3xl p-8 text-white backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

        <Typography variant="h4" fontWeight="bold" mb={4}>
          Borrow / Return
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextField label="Name" value={name}
            onChange={(e) => setName(e.target.value)} fullWidth sx={whiteInputSx} />
          <TextField label="Reg No" value={regNo}
            onChange={(e) => setRegNo(e.target.value)} fullWidth sx={whiteInputSx} />
        </div>

        <TextField label="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth sx={{ ...whiteInputSx, mb: 4 }} />

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel sx={{ color: "white" }}>Select Component</InputLabel>
          <Select
            value={selectedComponent}
            label="Select Component"
            onChange={(e) => setSelectedComponent(e.target.value)}
            onClose={() => setSearchText("")}
            sx={whiteInputSx}
          >
            <ListSubheader>
              <TextField
                size="small"
                placeholder="Search..."
                fullWidth
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

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Number(e.target.value)))
          }
          sx={{ ...whiteInputSx, mb: 6 }}
        />

        <div className="flex gap-6">
          <button
            onClick={() => handleAction("Borrow")}
            disabled={submitting}
            className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-bold 
            transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Processing..." : "BORROW"}
          </button>

          <button
            onClick={() => handleAction("Return")}
            disabled={submitting}
            className="flex-1 border-2 border-yellow-400 text-yellow-400 py-3 rounded-xl font-bold 
            transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:scale-[1.03]"
          >
            {submitting ? "Processing..." : "RETURN"}
          </button>
        </div>
      </Box>

      {popup.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-sm text-center shadow-2xl">
            <h3 className={`text-xl font-bold mb-2 ${
              popup.type === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {popup.type === "success" ? "Success!" : "Error"}
            </h3>
            <p className="text-gray-600 mb-6">{popup.message}</p>
            <button
              onClick={() => setPopup({ ...popup, open: false })}
              className="px-6 py-2 bg-[#003366] text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Box>
  );
};

export default BorrowReturnForm;