import { proxy } from "valtio";

//now we will create initial state using proxy in valtio

const state = proxy({
  //  says we are on first page or not
  intro: true,
  color: "#EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./threejs.png",
  fullDecal: "./threejs.png",
});

export default state;
