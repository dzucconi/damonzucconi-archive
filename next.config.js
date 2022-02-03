module.exports = {
  async rewrites() {
    return [
      {
        source: "/artworks",
        destination: "/",
      },
    ];
  },
};
