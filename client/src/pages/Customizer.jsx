import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import axios from "axios";
import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState(""); //to know which file is uploaded
  const [prompt, setPrompt] = useState(""); //to know what we type in ai
  const [generatingImg, setGeneratingImg] = useState(false); //to know image is loaded or not

  const [activeEditorTab, setActiveEditorTab] = useState(""); //to know which option from left filter section is selected
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  }); //for the bottom filters

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };
  const [imageData, setImageData] = useState(null); // State to hold image data
  //handle submit button function
  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    const url = "https://ai-color-generator.p.rapidapi.com/generate-color";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "46a2c7df55msh625eb4f0ed02452p15546fjsndab5aa3fdc39",
        "X-RapidAPI-Host": "ai-color-generator.p.rapidapi.com",
      },
      body: JSON.stringify({
        colorList: ["#FBE18F", "#1F271B"],
      }),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json(); // Parse JSON response
      console.log(data); // Verify the response structure

      // Check if images are present in the response
      // if (data.images && data.images.length > 0) {
      //   setImageData(data.images[0]); // Update state with image data
      // }
      // handleDecals(type, imageData);
    } catch (error) {
      console.error(error);
    }

    // try {
    //   setGeneratingImg(true);

    //   const deepAIOptions = {
    //     method: "POST",
    //     url: "https://ai-text-to-image-generator-api.p.rapidapi.com/realistic",
    //     headers: {
    //       "content-type": "application/json",
    //       "X-RapidAPI-Key":
    //         "46a2c7df55msh625eb4f0ed02452p15546fjsndab5aa3fdc39",
    //       "X-RapidAPI-Host": "ai-text-to-image-generator-api.p.rapidapi.com",
    //     },
    //     data: {
    //       inputs: prompt,
    //     },
    //   };

    //   // Make a request to DeepAI API using Axios
    //   const deepAIResponse = await axios.request(deepAIOptions);
    //   // const response = await fetch("http://localhost:8080/api/v1/dalle", {
    //   //   method: "POST",
    //   //   headers: {
    //   //     "Content-Type": "application/json",
    //   //   },
    //   //   body: JSON.stringify({
    //   //     prompt,
    //   //   }),
    //   // });

    //   // const data = await response.json();

    //   console.log(deepAIResponse);

    //   // handleDecals(type, `data:image/png;base64,${data.photo}`);
    // } catch (error) {
    //   alert(error);
    // } finally {
    //   setGeneratingImg(false);
    //   setActiveEditorTab("");
    // }
  };
  //function to change the decal value in the state
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    //now we will update the valtio state decal
    state[decalType.stateProperty] = result;

    //now we will toogle the bottom filter values

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };
  //function to toggle between the bottom filters

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };
  //function to read logo file from the system
  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="bg-red min-h-screen flex items-center">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      setActiveEditorTab(tab.name);
                    }}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute top-5 right-5 z-10"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
