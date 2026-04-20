// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   /* config options here */
// //   reactCompiler: true,
// // };

// // export default nextConfig;



// /** @type {import('next').NextConfig} */

// import withPWAInit from "next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
// });

// const nextConfig = {
//   reactCompiler: true,
//   allowedDevOrigins: ['192.168.1.13'], // dev only
// };

// export default withPWA(nextConfig);


import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ["192.168.1.13"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(nextConfig);