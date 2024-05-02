import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [currfile, setcurrfile] = useState<any>();
  const handleFileUpload = async (e: any) => {
    e.preventDefault();
    console.log(currfile[0]);
    const formData = new FormData();
    formData.append("file", currfile[0]);
    const res = axios.post("http://localhost:8080/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { data, err } = await res;
    console.log(data, err);
  };
  return (
    <div>
      {" "}
      <h2>File Upload With React Js</h2>
      <form action="/api/upload" typeof="multipart/form-data" method="post">
        <div>
          Select a file:
          <input
            type="file"
            name="file"
            onChange={(e) => setcurrfile(e.target.files)}
          />
        </div>
        <button onClick={handleFileUpload}>Upload</button>
      </form>
    </div>
  );
}

export default App;
