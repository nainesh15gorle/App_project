import React, { useState, useEffect, useMemo } from 'react';
import { auth } from '../firebase'; 
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  CircularProgress, 
  Box, 
  Typography,
  InputAdornment,
  ListSubheader
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutorenewIcon from '@mui/icons-material/Autorenew';

// --- Updated Interface to match your JSON ---
interface InventoryItem {
  _id: string; 
  COMPONENTS: string; // Matches your API
  QUANTITY: number;
}

interface UserState {
  name: string;
  regNo: string;
  email: string;
}

const StyledTextField = styled(TextField)({
  '& label': { color: '#94a3b8' },
  '& label.Mui-focused': { color: '#FFD700' },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: '#1e293b' },
    '&:hover fieldset': { borderColor: '#FFD700' },
    '&.Mui-focused fieldset': { borderColor: '#FFD700' },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '& .MuiInputBase-input': { color: 'white' }
});

const BorrowReturnForm: React.FC = () => {
  const [user, setUser] = useState<UserState>({ name: '', regNo: '', email: '' });
  const [components, setComponents] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedId, setSelectedId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currUser) => {
      if (currUser) {
        const displayName = currUser.displayName || "";
        const namePart = displayName.split(' (')[0];
        const regMatch = displayName.match(/\((RA\d+)\)/);
        setUser({
          name: namePart || "User",
          regNo: regMatch ? regMatch[1] : "N/A",
          email: currUser.email || ""
        });
      }
    });

    const fetchComponents = async () => {
      try {
        const response = await fetch('https://app-project-7ogo.onrender.com/items');
        const data = await response.json();
        // The data you provided is a direct array
        setComponents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
    return () => unsubscribe();
  }, []);

  // --- Fixed Search Logic using "COMPONENTS" key ---
  const filteredOptions = useMemo(() => {
    return components.filter((item) =>
      item.COMPONENTS?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, components]);

  const handleAction = async (type: 'Borrow' | 'Return') => {
    if (!selectedId) {
      alert("Please select a component");
      return;
    }

    const item = components.find((c) => c._id === selectedId);
    if (!item) {
      alert("Selected component not found in inventory list");
      return;
    }

    const endpoint = type === 'Borrow' ? '/borrow' : '/return';

    try {
      const response = await fetch(`https://app-project-7ogo.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          registrationNumber: user.regNo,
          componentId: selectedId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`[${endpoint.toUpperCase()}] Error:`, data);
        alert(data.message || `Failed to ${type.toLowerCase()} component`);
        return;
      }

      // Optimistically update the local quantity shown in the dropdown
      setComponents((prev) =>
        prev.map((c) =>
          c._id === selectedId
            ? {
                ...c,
                QUANTITY:
                  type === 'Borrow' ? c.QUANTITY - quantity : c.QUANTITY + quantity,
              }
            : c
        )
      );

      alert(`${type} successful for: ${item.COMPONENTS}`);
    } catch (error) {
      console.error(`[${endpoint.toUpperCase()}] Network/server error:`, error);
      alert('Server error. Please try again.');
    }
  };

  return (
    <Box className="min-h-screen bg-[#002b5c] flex items-center justify-center p-4">
      <Box className="w-full max-w-2xl bg-[#001f42] rounded-3xl shadow-2xl border border-blue-900/50 p-6 md:p-10">
        
        <header className="mb-8 text-center">
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 800 }}>Lab Inventory</Typography>
          <Typography sx={{ color: '#94a3b8' }}>SRM E-Yantra Robotics Lab</Typography>
        </header>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledTextField label="Name" value={user.name} fullWidth InputProps={{ readOnly: true }} />
            <StyledTextField label="Reg No" value={user.regNo} fullWidth InputProps={{ readOnly: true }} />
          </div>

          <FormControl fullWidth>
            <InputLabel id="search-select-label" sx={{ color: '#94a3b8' }}>Select Component</InputLabel>
            <Select
              labelId="search-select-label"
              value={selectedId}
              label="Select Component"
              onChange={(e) => setSelectedId(e.target.value)}
              onClose={() => setSearchText("")} 
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#1e293b' },
                '& .MuiSvgIcon-root': { color: 'white' }
              }}
              MenuProps={{
                autoFocus: false,
                PaperProps: {
                  sx: {
                    bgcolor: 'white',
                    maxHeight: 450,
                    '& .MuiMenuItem-root': {
                      color: 'black',
                      '&.Mui-selected': { bgcolor: '#FFD700 !important', color: '#002b5c' },
                    },
                  },
                },
              }}
            >
              {/* Integrated Search Bar inside Dropdown */}
              <ListSubheader sx={{ bgcolor: 'white', pt: 1, pb: 1 }}>
                <TextField
                  size="small"
                  autoFocus
                  placeholder="Search components..."
                  fullWidth
                  variant="outlined"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Escape') {
                      e.stopPropagation(); // Stops the dropdown from closing while typing
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </ListSubheader>

              {loading ? (
                <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Loading...</MenuItem>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
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
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleAction('Borrow')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-[#e6c200] text-[#002b5c] font-black py-4 rounded-xl transition-all"
            >
              BORROW <ArrowForwardIcon fontSize="small" />
            </button>
            <button
              type="button"
              onClick={() => handleAction('Return')}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white font-black py-4 rounded-xl transition-all"
            >
              RETURN <AutorenewIcon fontSize="small" />
            </button>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default BorrowReturnForm;