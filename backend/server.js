const express = require("express");
const cors = require("cors");
const path = require("path");
const pictureRoutes = require("./routes/pictureRoutes");
const videoRoutes = require("./routes/videoRoutes");
const pointRoutes = require("./routes/pointRoutes");
const statRoute = require("./routes/statRoute")
const tagRoutes = require("./routes/tagRoutes");
const pictureTagRoutes = require("./routes/pictureTagRoutes");
const picturePhotoAlbumRoutes = require("./routes/picturePhotoAlbumRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/videos", express.static(path.join(__dirname, "public/videos")));

// Routes
app.use("/api/v1", pictureRoutes);
app.use("/api/v1", videoRoutes);
app.use("/api/v1/points", pointRoutes);
app.use("/api/v1/stats", statRoute);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/picture-tags", pictureTagRoutes);
app.use("/api/v1/picture-photo-album", picturePhotoAlbumRoutes);


// Basic route for testing
app.get("/", (req, res) => {
  res.send("Livre De Bord API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
