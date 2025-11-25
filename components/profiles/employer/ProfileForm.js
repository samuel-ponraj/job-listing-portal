'use client'
import { Box, Button, Toolbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

import { Editor } from 'primereact/editor'; 
import 'primeicons/primeicons.css';

const ProfileForm = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    companyLogoURL: "",
    companyLogoStoragePath: "",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    companySize: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    description: "",
  });

  // ---------------- FETCH COMPANY PROFILE --------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/company", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          if (data.company) {
            setFormData((prev) => ({ ...prev, ...data.company }));
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ------------------- LOGO UPLOAD ---------------------------
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      // Delete old logo
      if (formData?.companyLogoStoragePath) {
        const oldRef = ref(storage, formData.companyLogoStoragePath);
        await deleteObject(oldRef).catch(() => {});
      }

      // Upload new logo
      const fileRef = ref(
        storage,
        `users/companyLogos/${file.name}-${Date.now()}`
      );

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const updatedData = {
        ...formData,
        companyLogoURL: downloadURL,
        companyLogoStoragePath: fileRef.fullPath,
      };

      setFormData(updatedData);

      // Save updated company data
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ company: updatedData }),
      });

      if (res.ok) {
        toast.success("Company logo updated!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update logo");
      }
    } catch (err) {
      console.error("Error uploading logo:", err);
      toast.error("Error uploading logo");
    } finally {
      setUploading(false);
    }
  };

  // ------------------- FORM SUBMIT ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ company: formData }),
      });

      if (res.ok) {
        toast.success("Company details saved successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save company details");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <Box component="section" sx={{ flexGrow: 1, marginTop:'30px' }}>
      <Toaster position="top-center" richColors />
      {/* <Toolbar /> */}

      <Box component="form"
        onSubmit={handleSubmit}
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
              src={formData.companyLogoURL || "/placeholder.png"}
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
              {uploading ? "Uploading..." : "Browse"}
            </label>

            <input
              id="logoUpload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              name="companyLogo" 
            />
          </Box>
        </Box>

        {/* Company Name */}
        <Box>
          <label>Company Name</label>
          <input name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            type="text"
            placeholder="Enter Company Name"
            style={inputStyle}
            required
          />
        </Box>

        {/* Contact Person */}
        <Box>
          <label>Contact Person</label>
          <input name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            type="text"
            placeholder="Enter Contact Person"
            style={inputStyle}
            required
          />
        </Box>

        {/* Email */}
        <Box>
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter Company Email"
            style={inputStyle}
            required
          />
        </Box>

        {/* Phone */}
        <Box>
          <label>Phone Number</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Enter Contact Number"
            style={inputStyle}
            required
          />
        </Box>

        {/* Website */}
        <Box sx={{ gridColumn: "1 / span 2" }}>
          <label>Website</label>
          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
            type="url"
            placeholder="Company Website URL"
            style={inputStyle}
            required
          />
        </Box>

        {/* Industry */}
        <Box>
          <label>Industry Type</label>
          <input
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            type="text"
            placeholder="IT, Healthcare, Education"
            style={inputStyle}
            required
          />
        </Box>

        {/* Company Size */}
        <Box>
          <label>Company Size</label>
          <input
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            type="number"
            placeholder="Employees Count"
            style={inputStyle}
            required
          />
        </Box>

        {/* Address */}
        <Box sx={{ gridColumn: "1 / span 2" }}>
          <label>Address Line</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            type="text"
            placeholder="Street Address"
            style={inputStyle}
            required
          />
        </Box>

        {/* City */}
        <Box>
          <label>City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            type="text"
            placeholder="City"
            style={inputStyle}
            required
          />
        </Box>

        {/* Pincode */}
        <Box>
          <label>Pincode</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            type="text"
            placeholder="Pincode"
            style={inputStyle}
            required
          />
        </Box>

        {/* State */}
        <Box>
          <label>State</label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            type="text"
            placeholder="State"
            style={inputStyle}
            required
          />
        </Box>

        {/* Country */}
        <Box>
          <label>Country</label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            type="text"
            placeholder="Country"
            style={inputStyle}
            required
          />
        </Box>

        
    

        <Box sx={{ gridColumn: "1 / span 2" }}>
          <label htmlFor="description" style={{marginBottom:'10px'}}>Company Description</label>
          <Editor
            name="description"
            value={formData.description}
            onTextChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.htmlValue,  
              }))
            } 
            required
            style={{ minHeight: '300px', backgroundColor: 'white' }}
          />
          </Box>
        

        <Box sx={{ gridColumn: "1 / span 2", textAlign: "center" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 2, backgroundColor: "var(--background)" }}
          >
            Save Company Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Reusable Styles
const inputStyle = {
  width: '100%',
  padding: '10px',
  border:'none',
  borderRadius: '6px',
  marginTop: '6px',
  boxShadow: ' rgba(0, 0, 0, 0.04) 0px 3px 5px'
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  border: 'none',
  borderRadius: '6px',
  marginTop: '6px',
  resize: 'vertical',
  fontFamily:'inherit',
  boxShadow: '  rgba(0, 0, 0, 0.04) 0px 3px 5px'
};

export default ProfileForm;
