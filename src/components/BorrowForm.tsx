import React, { useEffect, useMemo, useState } from "react";
import { auth } from "../firebase";
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
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutorenewIcon from "@mui/icons-material/Autorenew";

/* ================= CONFIG ================= */

const API_BASE_URL = "https://app-project-1-uqey.onrender.com";

/* ================= TYPES ================= */

interface InventoryItem {
  COMPONENTS: string;
  QUANTITY: number;
}

interface UserState {
  name: string;
  regNo: string;
  email: string;
}

/* ================= STYLES ================= */

const StyledTextField = styled(TextField)({
  "& label": { color: "#94a3b8" },
  "& label.Mui-focused": { color: "#FFD700" },
  "& .MuiOutlinedInput-root": {
    color: "white",
    backgroundColor: "rgba(255,255,255,0.05)",
    "& fieldset": { borderColor: "#1e293b" },
    "&:hover fieldset": { borderColor: "#FFD700" },
    "&.Mui-focused fieldset": { borderColor: "#FFD700" },
  },
});

/* ================= COMPONENT ================= */

const BorrowReturnForm: React.FC = () => {
  const [user, setUser] = useState<UserState>({
    name: "",
    regNo: "",
    email: "",
  });

  const [components, setComponents] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ STORE COMPONENT NAME (NOT ID)
  const [selectedComponent, setSelectedComponent] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchText, setSearchText] = useState("");

  /* ================= AUTH + INVENTORY ================= */

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currUser) => {
      if (!currUser) return;

      const displayName = currUser.displayName || "";
      const namePart = displayName.split(" (")[0];
      const regMatch = displayName.match(/\((RA\d+)\)/);

      setUser({
        name: namePart || "User",
        regNo: regMatch ? regMatch[1] : "N/A",
        email: currUser.email || "",
      });
    });

    const fetchInventory = async () => {
      try {
        const res = await fetch("https://app-project-7ogo.onrender.com/items");
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
            i.COMPONENTS.length > 0 &&
            Number.isFinite(i.QUANTITY)
        )
    : []
);

      } catch (err) {
        console.error("Inventory fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
    return () => unsubscribe();
  }, []);

  /* ================= SEARCH ================= */

  const filteredComponents = useMemo(() => {
    return components.filter((c) =>
      c.COMPONENTS.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [components, searchText]);

  /* ================= BORROW / RETURN ================= */

  const handleAction = async (type: "Borrow" | "Return") => {
  if (!selectedComponent.trim()) {
    alert("Please select a component");
    return;
  }

  if (!quantity || quantity <= 0) {
    alert("Quantity must be at least 1");
    return;
  }

  const endpoint = type === "Borrow" ? "/borrow" : "/return";

  try {
    const payload =
      type === "Borrow"
        ? {
            name: user.name,
            registrationNumber: user.regNo,
            COMPONENTS: selectedComponent,
            QUANTITY: Number(quantity),
          }
        : {
            name: user.name,
            registrationNumber: user.regNo,
            component: selectedComponent, // backend finds Item using this
            quantity: Number(quantity),
          };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Operation failed");
      return;
    }

    // Optimistic UI update
    setComponents((prev) =>
      prev.map((c) =>
        c.COMPONENTS === selectedComponent
          ? {
              ...c,
              QUANTITY:
                type === "Borrow"
                  ? c.QUANTITY - quantity
                  : c.QUANTITY + quantity,
            }
          : c
      )
    );

    alert(`${type} successful`);
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  /* ================= UI ================= */

  return (
    <Box className="min-h-screen bg-[#002b5c] flex items-center justify-center p-4">
      <Box className="w-full max-w-2xl bg-[#001f42] rounded-3xl shadow-2xl p-8 border border-blue-900/50">
        <Typography variant="h4" color="white" fontWeight={800} align="center">
          Lab Inventory
        </Typography>
        <Typography color="#94a3b8" align="center" mb={4}>
          SRM E-Yantra Robotics Lab
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StyledTextField
            label="Name"
            value={user.name}
            InputProps={{ readOnly: true }}
          />
          <StyledTextField
            label="Reg No"
            value={user.regNo}
            InputProps={{ readOnly: true }}
          />
        </div>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel sx={{ color: "#94a3b8" }}>
            Select Component
          </InputLabel>
          <Select
            value={selectedComponent}
            label="Select Component"
            onChange={(e) => setSelectedComponent(e.target.value)}
            onClose={() => setSearchText("")}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
          >
            <ListSubheader>
              <TextField
                size="small"
                fullWidth
                placeholder="Search components..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </ListSubheader>

            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={18} sx={{ mr: 1 }} />
                Loading...
              </MenuItem>
            ) : filteredComponents.length > 0 ? (
              filteredComponents.map((item) => (
                <MenuItem
                  key={item.COMPONENTS}
                  value={item.COMPONENTS}   // ✅ FIXED
                >
                  {item.COMPONENTS} ({item.QUANTITY} left)
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No components found</MenuItem>
            )}
          </Select>
        </FormControl>

        <StyledTextField
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          sx={{ mb: 4 }}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => handleAction("Borrow")}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-[#e6c200] text-[#002b5c] font-black py-4 rounded-xl"
          >
            BORROW <ArrowForwardIcon fontSize="small" />
          </button>

          <button
            type="button"
            onClick={() => handleAction("Return")}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white font-black py-4 rounded-xl"
          >
            RETURN <AutorenewIcon fontSize="small" />
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default BorrowReturnForm;
