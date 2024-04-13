import React, { useState } from "react";

const AddTopic = () => {
  const [topic, setTopic] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {const token = localStorage.getItem("Token");
      const response = await fetch("http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ name: topic }),
      });
      if (!response.ok) {
        throw new Error("Failed to add topic.");
      }
      const data = await response.json();
      setResponseMessage(data);
      // Reset the topic input
      setTopic("");
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Topic</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Add Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={handleTopicChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      {responseMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
          New topic added successfully: {responseMessage.name}
        </div>
      )}
    </div>
  );
};

export default AddTopic;