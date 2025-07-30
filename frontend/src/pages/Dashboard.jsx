import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, PlayArrow as PlayIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import TrackUpload from "../components/TrackUpload";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await api.get("/music/tracks/");
      setTracks(response.data);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newTrack) => {
    setTracks((prev) => [newTrack, ...prev]);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">
            Welcome back, {user?.artist_name || user?.username}!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadOpen(true)}
          >
            Upload Track
          </Button>
        </Box>

        <Grid container spacing={3}>
          {tracks.map((track) => (
            <Grid item xs={12} md={6} lg={4} key={track.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {track.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {track.genre_name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Chip
                      label={track.status}
                      color={
                        track.status === "distributed" ? "success" : "default"
                      }
                      size="small"
                    />
                    <IconButton>
                      <PlayIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {tracks.length === 0 && (
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No tracks uploaded yet
            </Typography>
            <Typography color="textSecondary">
              Upload your first track to get started!
            </Typography>
          </Box>
        )}
      </Box>

      <TrackUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </Container>
  );
};

export default Dashboard;
