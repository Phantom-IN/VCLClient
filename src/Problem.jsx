import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import linkImage from "./assets/link.png";
import unsolved from "./assets/unsolved.png";
import ideaicon from "./ideaicon.png";
import EditButton from "./EditButton"; // Import EditButton component
import {
  FaTachometerAlt,
  FaFileDownload,
  FaCheck,
  FaStar,
  FaBolt
} from "react-icons/fa";

const ProblemPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [verificationResponseMessage, setVerificationResponseMessage] =
    useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [subAdmin, setSubAdmin] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });
  const [vmData, setVmData] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const userResponse = await fetch(`${backendUrl}/user`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setAdmin(userData.admin);
        setSubAdmin(userData.subadmin); // Set subadmin value
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/challenge/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch challenge details.");
        }
        const data = await response.json();
        setChallenge(data);
      } catch (error) {
        console.error("Error loading the challenge:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const requestVirtualMachine = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/req_vm`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(
          `Failed to request virtual machine. Status: ${response.status}`
        );
      }
      const data = await response.json();
      if (data && data.message) {
        setResponseMessage(data.message);
        setVmData(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error requesting virtual machine:", error);
      setResponseMessage({
        message: "An error occurred while requesting the virtual machine.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/export_lab/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download file.");
      }

      // Convert the response to a blob
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger the download
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = ""; // This will use the filename provided by the server
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    localStorage.setItem("selectedTopic", topicId);
    navigate("/home");
  };

  const handleSubmitAnswer = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/verify/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ flag: userAnswer }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify flag.");
      }
      const responseData = await response.json();
      setVerificationResponseMessage(responseData.message);
    } catch (error) {
      console.error("Error verifying flag:", error);
      setVerificationResponseMessage("Failed to verify flag.");
    }
  };

  if (!challenge) return <p>No challenge data found.</p>;

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      <Sidebar
        showMenu={showMenu}
        onTopicSelect={handleTopicChange}
        activeTopic={selectedTopic}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: "#e0efee" }}>
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
        <div className="px-4">
          <div className="container mx-auto pt-8 px-8 pb-2">
            <div className="mb-8 flex justify-between items-center font-semibold">
              {admin && (
                <EditButton admin={subAdmin} /> // Use the subAdmin value instead of admin
              )}
              {admin && (
                <FaFileDownload
                  className="text-lg text-blue-900 cursor-pointer"
                  onClick={handleDownload}
                  title="Download Responses"
                  admin={subAdmin}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-8">
              {/* Open the Virtual Lab */}

              <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-lg shadow-lg w-full flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold mb-4 text-center text-white">
                    {challenge.name}
                  </h1>
                  <div className="flex justify-around w-full mb-4 space-x-8">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
                        <FaTachometerAlt className="text-orange-400 text-2xl" />
                      </div>
                      <p className="text-sm font-semibold text-white mt-1">
                        {challenge.difficulty}
                      </p>
                      {/* Display difficulty level */}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
                        {challenge.solved ? (
                          <FaCheck className="text-yellow-500 text-xl" />
                        ) : (
                          <img
                            src={unsolved}
                            alt="Unsolved"
                            className="w-10 h-10"
                          />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-white mt-1">
                        {challenge.solved ? "Solved" : "Unsolved"}
                      </p>
                      {/* Display attempt */}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
                        <FaStar className="text-blue-500 text-xl" />
                      </div>
                      <p className="text-sm font-semibold text-white mt-1">
                        {challenge.score} Points
                      </p>
                      {/* Display speed */}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                  <button
  className={`font-semibold px-4 py-2 rounded flex items-center justify-center ${
    vmData && vmData.vm_url
      ? 'bg-blue-900 text-white'
      : 'bg-white text-003366 hover:bg-blue-200'
  }`}
  onClick={() => {
    if (challenge.lab_link) {
      window.open(challenge.lab_link, "_blank");
    } else if (vmData && vmData.vm_url) {
      window.open(vmData.vm_url, "_blank");
    } else {
      requestVirtualMachine();
    }
  }}
  disabled={isLoading}
>
  <span className="mr-2">
    {isLoading ? "Loading..." : vmData && vmData.vm_url ? "Open Simulator" : "Start Simulator"}
  </span>
  <FaBolt />
</button>
  {vmData && vmData.password && (
    <div className="mt-2 text-center text-blue-900">
      <p className="font-semibold">
        Password: {vmData.password}
      </p>
    </div>
  )}
</div>
                </div>
              </div>

              {/* Submit Answer */}
              <div
                style={{ backgroundColor: "#11255a", height: "230px" }}
                className="p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-lg font-semibold mb-4 text-white text-center">
                  Submit Answer
                </h2>
                <p className="text-sm text-white mb-4 text-center">
                  Practice the given challenge and submit the answer
                </p>
                <div className="flex items-center justify-center mb-4">
                  <input
                    type="text"
                    placeholder="Your answer..."
                    className="w-100p px-4 py-2 rounded border border-003366 focus:outline-none focus:border-blue-400 text-003366"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-semibold ml-2"
                    onClick={handleSubmitAnswer}
                    disabled={isLoading}
                  >
                    Submit
                  </button>
                </div>
                {/* Display verification response message */}
                {verificationResponseMessage && (
                  <div className="text-green-500 text-center py-2">
                    {verificationResponseMessage}
                  </div>
                )}
              </div>

              {/* Problem Statement */}
              <div className="col-span-2 sm:col-span-1 pr-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="border-b-2 border-blue-900 text-lg font-bold mb-4">
                    Problem Statement
                  </h2>
                  <p className="mb-4" style={{ wordWrap: "break-word" }}>
                    {challenge.problem_statement}
                  </p>
                  {challenge.supporting_material !== "NULL" && (
                    <div className="flex items-center">
                      <a
                        href={
                          challenge.supporting_material.startsWith("https")
                            ? challenge.supporting_material
                            : `http://${challenge.supporting_material}`
                        }
                        className="text-base font-semibold mb-2"
                        target="_blank"
                      >
                        Supporting Material
                      </a>
                      <img
                        src={linkImage}
                        alt="Link"
                        className="w-4 h-4 ml-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Prohibited Activities */}
              <div className="col-span-2 sm:col-span-1 pl-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="border-b-2 border-blue-900 text-lg font-bold mb-4">
                    Prohibited Activities
                  </h2>
                  <p>
                    Please note that the following activities are strictly
                    prohibited on any of the attack boxes, except if allowed in
                    the description to do same:
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>No Automatic scanners Allowed</li>
                    <li>DOS or DDOS Attack</li>
                    <li>No Directory Bruteforce Allowed</li>
                    <li>Attacking any Lab Instance</li>
                    <li>Gaining access to other users' machines</li>
                    <li>Attack on this site anyhow</li>
                    <li>No Payload Injection Allowed</li>
                  </ul>
                  <p>
                    If found any of these rules to be not followed, actions will
                    be taken accordingly.
                  </p>
                </div>
              </div>
            </div>
            {/* Check Solution Button */}
            <div className="flex justify-start">
              <div className="-mt-8 pb-4">
                {" "}
                {/* Adjust the negative margin value as needed */}
                {(challenge.solution !== "" || admin) && (
                  <a
                    href={
                      challenge.solution.startsWith("https")
                        ? challenge.solution
                        : `http://${challenge.solution}`
                    }
                    style={{ backgroundColor: "#11255a" }}
                    className="text-white px-6 py-4 rounded hover:bg-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={ideaicon}
                      alt="Image"
                      className="w-6 h-6 mr-1 inline -mt-1"
                    />
                    Check Solution
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
