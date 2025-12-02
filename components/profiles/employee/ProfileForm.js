import { Box, Button, Toolbar } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const ProfileForm = () => {

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    photoURL:"",
    fullName: "",
    dob: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
    qualification: "",
    languages: "",
    skills: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    summary:""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFormData((prev) => ({ ...prev, ...data.profile }));
          }
        } else {
          const err = await res.json();
          console.warn("Failed to fetch profile:", err.error);
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

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setUploading(true);
    if (formData?.photoStoragePath) {
      const oldRef = ref(storage, formData.photoStoragePath);
      await deleteObject(oldRef).catch(() => {});
    }
    const fileRef = ref(
      storage,
      `users/profilePhotos/${file.name}-${Date.now()}`
    );

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    const updatedData = {
      ...formData,
      photoURL: downloadURL,
      photoStoragePath: fileRef.fullPath, 
    };

    setFormData(updatedData);

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      toast.success("Profile photo updated!");
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to update profile photo");
    }
  } catch (err) {
    console.error("Error uploading photo:", err);
    toast.error("Error uploading photo");
  } finally {
    setUploading(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (res.ok) {
        toast.success("Profile saved successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save profile");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <Box
      component="section"
      sx={{
        flexGrow: 1,
        marginTop:'30px'
      }}
    >
      <Toaster position="top-center" richColors />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
        }}
      >
        <Box sx={{ gridColumn: '1 / span 2' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 8 }}>
            Upload Photo
          </label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src={formData.photoURL || '/placeholder.png'}
              alt="Thumbnail"
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
            <label
              htmlFor="fileUpload"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                border: '1px solid #888',
                borderRadius: '6px',
                cursor: 'pointer',
                background: '#f7f7f7',
              }}
            >
              {uploading ? 'Uploading...' : 'Browse'}
            </label>
            <input id="fileUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange}/>
          </Box>
        </Box>

   
        <Box>
          <label>Full Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="Enter your Full Name"
            style={inputStyle}
            onChange={handleChange}
            value={formData.fullName}
            required
          />
        </Box>

       
        <Box>
          <label>Date of Birth</label>
          <input type="date" style={inputStyle} onChange={handleChange} name="dob" value={formData.dob} required/>
        </Box>

       
        <Box>
          <label>Gender</label>
          <input
          name="gender"
            type="text"
            placeholder="Male / Female"
            style={inputStyle}
            onChange={handleChange}
            value={formData.gender}
            required
          />
        </Box>

    
        <Box>
          <label>Age</label>
          <input
          name="age"
            type="number"
            placeholder="Enter your Age"
            style={inputStyle}
            onChange={handleChange}
            value={formData.age}
            required
          />
        </Box>

        <Box>
          <label>Phone Number</label>
          <input
          name="phone"
            type="tel"
            placeholder="Enter your Phone Number"
            style={inputStyle}
            onChange={handleChange}
            value={formData.phone}
            required
          />
        </Box>

        <Box>
          <label>Email</label>
          <input
          name="email"
            type="email"
            placeholder="Enter your Email"
            style={inputStyle}
            onChange={handleChange}
            value={formData.email}
            required
          />
        </Box>

        <Box>
          <label>Qualification</label>
          <input
          name="qualification"
            type="text"
            placeholder="Enter your Qualification"
            style={inputStyle}
            onChange={handleChange}
            value={formData.qualification}
            required
          />
        </Box>

        <Box>
          <label>Languages Known</label>
          <input
          name="languages"
            type="text"
            placeholder="Enter known languages"
            style={inputStyle}
            onChange={handleChange}
            value={formData.languages}
            required
          />
        </Box>

        <Box sx={{ gridColumn: '1 / span 2' }}>
              <label>Profile Summary</label>
              <textarea 
                name='summary'
                type='text'
                placeholder='About you...'
                style={textareaStyle}
                rows={5}
                onChange={handleChange}
                value={formData.summary}
                required>

              </textarea>
        </Box>

        <Box sx={{ gridColumn: '1 / span 2' }}>
          <label>Skills</label>
          <input
          name='skills'
            type="text"
            placeholder="Enter Skills"
            style={inputStyle}
            onChange={handleChange}
            value={formData.skills}
            required
          />
        </Box>

        <Box sx={{ gridColumn: '1 / span 2' }}>
          <label>Address Line 1</label>
          <input
          name="address"
            type="text"
            placeholder="Enter Address"
            style={inputStyle}
            onChange={handleChange}
            value={formData.address}
          />
        </Box>

        <Box>
          <label>City</label>
          <input name="city" type="text" placeholder="Enter City" style={inputStyle} onChange={handleChange} value={formData.city} required/>
        </Box>

        <Box>
          <label>Pincode</label>
          <input name="pincode" type="text" placeholder="Enter Pincode" style={inputStyle} onChange={handleChange} value={formData.pincode} required/>
        </Box>

        <Box>
          <label>State</label>
          <input name="state" type="text" placeholder="Enter State" style={inputStyle} onChange={handleChange} value={formData.state} required/>
        </Box>

        <Box>
          <label>Country</label>
          <input name="country" type="text" placeholder="Enter Country" style={inputStyle} onChange={handleChange} value={formData.country} required/>
        </Box>

        <Box sx={{ gridColumn: "1 / span 2", textAlign: "center" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 2, backgroundColor: "var(--background)" }}
          >
            Save Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Reusable inline style
const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  marginTop: '6px',
  boxShadow: '  rgba(0, 0, 0, 0.04) 0px 3px 5px'
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  marginTop: '6px',
  resize: 'vertical',
  fontFamily:'inherit',
  boxShadow: '  rgba(0, 0, 0, 0.04) 0px 3px 5px'
};

export default ProfileForm;
