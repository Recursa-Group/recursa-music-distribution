import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import api from "../services/api";

const TrackUpload = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    release_date: "",
    explicit_content: false,
  });
  const [files, setFiles] = useState({ audio_file: null, artwork: null });
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (open) {
      fetchGenres();
    }
  }, [open]);

  const fetchGenres = async () => {
    try {
      const response = await api.get("/music/genres/");
      setGenres(response.data);
    } catch (error) {
      console.error("Failed to fetch genres:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const uploadData = new FormData();
    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });

    if (files.audio_file) uploadData.append("audio_file", files.audio_file);
    if (files.artwork) uploadData.append("artwork", files.artwork);

    try {
      const response = await api.post("/music/upload/", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      onSuccess(response.data);
      handleClose();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      genre: "",
      release_date: "",
      explicit_content: false,
    });
    setFiles({ audio_file: null, artwork: null });
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Upload New Track</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="title"
            label="Track Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Genre</InputLabel>
            <Select
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              required
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            name="release_date"
            label="Release Date"
            type="date"
            value={formData.release_date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                name="explicit_content"
                checked={formData.explicit_content}
                onChange={handleInputChange}
              />
            }
            label="Explicit Content"
          />

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 1 }}
            >
              Upload Audio File *
              <input
                type="file"
                name="audio_file"
                hidden
                accept="audio/*"
                onChange={handleFileChange}
                required
              />
            </Button>
            {files.audio_file && (
              <Typography variant="body2" color="textSecondary">
                {files.audio_file.name}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload Artwork (Optional)
              <input
                type="file"
                name="artwork"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {files.artwork && (
              <Typography variant="body2" color="textSecondary">
                {files.artwork.name}
              </Typography>
            )}
          </Box>

          {loading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Uploading... {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Uploading..." : "Upload Track"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TrackUpload;
