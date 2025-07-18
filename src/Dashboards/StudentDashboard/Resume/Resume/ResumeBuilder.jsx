import React, { useState, useEffect, useRef } from "react";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import ResumeTemplate1 from "../Template/ResumeTemplate1";
import ResumeTemplate2 from "../Template/ResumeTemplate2";

const ResumeBuilder = ({ studentData, goToNext }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [previewUrl, setPreviewUrl] = useState(null);
  const pdfRef = useRef(null);

  const student = localStorage.getItem("studentData");
  console.log("Student Data in localStorage:", student);

  const templates = {
    template1: <ResumeTemplate1 studentData={studentData} />,
    template2: <ResumeTemplate2 studentData={studentData} />,
    // template3: <ResumeTemplate3  />,
    // template4: <ResumeTemplate4  />,
    // template5: <ResumeTemplate5  />,
    // template7: <ResumeTemplate7  />,
    // template8: <ResumeTemplate8  />,
  };
  useEffect(() => {
    const generatePreview = async () => {
      const blob = await pdf(templates[selectedTemplate]).toBlob();
      setPreviewUrl(URL.createObjectURL(blob));
    };

    generatePreview();
  }, [selectedTemplate]);

  return (
    <div className="container mx-auto p-5 mb-10">
      <div className=" flex ">
      <h1 className="text-lg font-bold">Resume Builder: </h1>
      
      <label className="font-medium mx-2 "> Choose a Resume Template:</label>
      <select
        className="border rounded"
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
      >
        <option value="template1">Template 1</option>
        <option value="template2">Template 2</option>
         {/*<option value="template3">Template 3</option>
        <option value="template4">Template 4</option>
        <option value="template5">Template 5</option>
        <option value="template7">Template 7</option>
        <option value="template8">Template 8</option> */}
      </select>

       {/* ✅ Full-Page Preview */}
       {/* {previewUrl && (
        <div className="border p-5 mt-3">
          <iframe src={previewUrl} className="w-full h-screen"></iframe>
        </div>
      )} */}

    </div>
      {/* ✅ Live Preview of Resume */}
      <div className="border p-5 mt-3">
        <PDFViewer style={{ width: "100%", height: "1000px", marginBottom: "20px", paddingBottom: "100px", border: "1px solid #ccc" }}>
          {templates[selectedTemplate]}
        </PDFViewer >
      </div>

      {/* ✅ Download Button */}
      <div className="mt-5">
        <PDFDownloadLink
          document={templates[selectedTemplate]}
          fileName="resume.pdf"
          className="bg-blue-500 text-white p-3 rounded"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download Resume")}
        </PDFDownloadLink>
      </div>
    </div>
  );
};



export default ResumeBuilder;