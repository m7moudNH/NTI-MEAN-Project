export const environment = {
  production: false,
  // Update these to match wherever your backend's PORT env var points it at.
  // The backend mounts routes under /api/v1 (see backend/index.js).
  apiOrigin: 'http://localhost:5000',
  apiUrl: 'http://localhost:5000/api/v1',
  // NOTE: backend/index.js never calls app.use('/uploads', express.static(...)),
  // so uploaded product/user images are saved to disk but are not actually served
  // over HTTP yet. Image <img> tags below will 404 until that's added backend-side.
};
