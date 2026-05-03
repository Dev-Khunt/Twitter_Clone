import ImageKit from "imagekit";
import dotenv from 'dotenv';

dotenv.config();

const imagekit = new ImageKit({
  publicKey: "public_k56xUKzmzKV1LjTAzSBivWN/qIQ=",
  privateKey: "private_sMuNghvS8ihrvdk7tPV+5bLoI0I=",
  urlEndpoint: "https://ik.imagekit.io/mgywtmla7",
});

export default imagekit;