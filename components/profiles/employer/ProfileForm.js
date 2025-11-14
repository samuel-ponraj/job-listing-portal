
import { Box, Toolbar } from '@mui/material';
import { Toaster, toast } from 'sonner'

const ProfileForm = () => {



  return (
    <Box
      component="section"
      sx={{
        flexGrow: 1,
      }}
    >
      <Toaster position="top-center" richColors />
      <Toolbar />

      <Box
        component="form"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Upload Company Logo */}
        <Box sx={{ gridColumn: '1 / span 2' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 8 }}>
            Upload Company Logo
          </label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src="/placeholder.png"
              alt="Company Logo"
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
            <label  
              htmlFor="logoUpload"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                border: '1px solid #888',
                borderRadius: '6px',
                cursor: 'pointer',
                background: '#f7f7f7',
              }}
            >
              Browse
            </label>
            <input id="logoUpload" type="file" style={{ display: 'none' }} />
          </Box>
        </Box>

        {/* Company Name */}
        <Box>
          <label>Company Name</label>
          <input
            type="text"
            placeholder="Enter Company Name"
            style={inputStyle}
          />
        </Box>

        {/* Contact Person */}
        <Box>
          <label>Contact Person</label>
          <input
            type="text"
            placeholder="Enter Contact Person Name"
            style={inputStyle}
          />
        </Box>

        {/* Email */}
        <Box>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Company Email"
            style={inputStyle}
          />
        </Box>

        {/* Phone Number */}
        <Box>
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="Enter Contact Number"
            style={inputStyle}
          />
        </Box>

        {/* Website */}
        <Box sx={{ gridColumn: '1 / span 2' }}>
          <label>Website</label>
          <input
            type="url"
            placeholder="Enter Company Website URL"
            style={inputStyle}
          />
        </Box>

        {/* Industry Type */}
        <Box>
          <label>Industry Type</label>
          <input
            type="text"
            placeholder="e.g. IT, Healthcare, Education"
            style={inputStyle}
          />
        </Box>

        {/* Company Size */}
        <Box>
          <label>Company Size</label>
          <input
            type="number"
            placeholder="Number of Employees"
            style={inputStyle}
          />
        </Box>

        {/* Address Line 1 */}
        <Box sx={{ gridColumn: '1 / span 2' }}>
          <label>Address Line 1</label>
          <input
            type="text"
            placeholder="Enter Street Address"
            style={inputStyle}
          />
        </Box>

        {/* City */}
        <Box>
          <label>City</label>
          <input type="text" placeholder="Enter City" style={inputStyle} />
        </Box>

        {/* Pincode */}
        <Box>
          <label>Pincode</label>
          <input type="text" placeholder="Enter Pincode" style={inputStyle} />
        </Box>

        {/* State */}
        <Box>
          <label>State</label>
          <input type="text" placeholder="Enter State" style={inputStyle} />
        </Box>

        {/* Country */}
        <Box>
          <label>Country</label>
          <input type="text" placeholder="Enter Country" style={inputStyle} />
        </Box>

        {/* Company Description */}
        <Box sx={{ gridColumn: '1 / span 2' }}>
          <label>Company Description</label>
          <textarea
            placeholder="Write a brief description about the company"
            rows={4}
            style={textareaStyle}
          ></textarea>
        </Box>
      </Box>
    </Box>
  );
};

// Reusable inline styles
const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  marginTop: '6px',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  marginTop: '6px',
  resize: 'vertical',
};

export default ProfileForm;
