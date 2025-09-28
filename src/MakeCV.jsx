import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./MakeCV.css";

function CVTemplate({ data, photoUrl, template }) {
  const templateClass = `cv-template template-${template}`;

  return (
    <div className={templateClass} id="cv-template">
      <div className="cv-header">
        <div>
          <h1>{data.name || "Your Name"}</h1>
          <p className="cv-contact">
  {data.email ? (
    <a href={`mailto:${data.email}`} className="cv-email">
      {data.email}
    </a>
  ) : (
    ""
  )}
  {data.phone ? ` | ${data.phone}` : ""}
  {data.linkedin ? (
    <>
      {" | LinkedIn: "}
      <a
        href={`https://www.linkedin.com/in/${data.linkedin}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {data.linkedin}
      </a>
    </>
  ) : null}
</p>


        </div>
        {photoUrl && <img src={photoUrl} alt="photo" className="cv-photo" />}
      </div>

      {data.summary && (
        <>
          <h3>Summary</h3>
          <p>{data.summary}</p>
        </>
      )}

      {data.education?.length > 0 && (
        <>
          <h3>Education</h3>
          <ul>
            {data.education.map((e, i) => (
              <li key={i}>
                <strong>{e.level}</strong> — {e.degree} at {e.institute}
                {e.year ? ` (${e.year})` : ""}{" "}
                {e.percentage && `– ${e.percentage}%`}{" "}
                {e.status && `– ${e.status}`}
              </li>
            ))}
          </ul>
        </>
      )}

      {data.experience?.length > 0 && (
        <>
          <h3>Experience / Projects</h3>
          <ul>
            {data.experience.map((ex, i) => (
              <li key={i}>
                <strong>{ex.title}</strong> — {ex.company}{" "}
                {ex.duration ? `(${ex.duration})` : ""}
                <div className="small">{ex.desc}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      {data.certifications?.length > 0 && (
        <>
          <h3>Certifications / Achievements</h3>
          <ul>
            {data.certifications.map((c, i) => (
              <li key={i}>
                <strong>{c.name}</strong> — {c.issuer}{" "}
                {c.year ? `(${c.year})` : ""}
                {c.fileName && (
                  <>
                    {" – "}
                    <a href={c.fileUrl} target="_blank" rel="noopener noreferrer">
                      View Certificate
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {data.skills && (
        <>
          <h3>Skills</h3>
          <div className="skills">
            {data.skills.split(",").map((s, i) => (
              <span key={i} className="skill-chip">
                {s.trim()}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function MakeCV() {
  const initialData = {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    summary: "",
    education: [
      { level: "", degree: "", institute: "", year: "", percentage: "", status: "" },
    ],
    experience: [{ title: "", company: "", duration: "", desc: "" }],
    certifications: [{ name: "", issuer: "", year: "", fileUrl: "", fileName: "" }],
    skills: "",
  };

  const [data, setData] = useState(initialData);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("1");
  const componentRef = useRef();

  useEffect(() => {
    const draft = localStorage.getItem("cv_draft");
    if (draft) {
      try {
        const loaded = JSON.parse(draft);
        setData((prev) => ({ ...prev, ...loaded }));
      } catch {
        // Ignore JSON parse errors and use default data
      }
    }
  }, []);

  useEffect(() => {
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      setPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPhotoUrl("");
  }, [photoFile]);

  const handleChange = (key) => (e) =>
    setData((p) => ({ ...p, [key]: e.target.value }));

  /* ---------- Education ---------- */
  const setEducationField = (i, field, v) =>
    setData((p) => {
      const edu = [...p.education];
      edu[i] = { ...edu[i], [field]: v };
      return { ...p, education: edu };
    });
  const addEducation = () =>
    setData((p) => ({
      ...p,
      education: [
        ...p.education,
        { level: "", degree: "", institute: "", year: "", percentage: "", status: "" },
      ],
    }));
  const removeEducation = (i) =>
    setData((p) => ({
      ...p,
      education: p.education.filter((_, idx) => idx !== i),
    }));

  /* ---------- Experience ---------- */
  const setExperienceField = (i, field, v) =>
    setData((p) => {
      const ex = [...p.experience];
      ex[i] = { ...ex[i], [field]: v };
      return { ...p, experience: ex };
    });
  const addExperience = () =>
    setData((p) => ({
      ...p,
      experience: [
        ...p.experience,
        { title: "", company: "", duration: "", desc: "" },
      ],
    }));
  const removeExperience = (i) =>
    setData((p) => ({
      ...p,
      experience: p.experience.filter((_, idx) => idx !== i),
    }));

  /* ---------- Certifications ---------- */
  const setCertificationField = (i, field, v) =>
    setData((p) => {
      const certs = [...p.certifications];
      certs[i] = { ...certs[i], [field]: v };
      return { ...p, certifications: certs };
    });
  const addCertification = () =>
    setData((p) => ({
      ...p,
      certifications: [
        ...p.certifications,
        { name: "", issuer: "", year: "", fileUrl: "", fileName: "" },
      ],
    }));
  const removeCertification = (i) =>
    setData((p) => ({
      ...p,
      certifications: p.certifications.filter((_, idx) => idx !== i),
    }));
  const handleCertFile = (i, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Certificate file must be ≤ 5 MB");
      setTimeout(() => setMessage(""), 2500);
      return;
    }
    const url = URL.createObjectURL(file);
    setCertificationField(i, "fileUrl", url);
    setCertificationField(i, "fileName", file.name);
  };

  const saveDraft = () => {
    localStorage.setItem("cv_draft", JSON.stringify(data));
    setMessage("Draft saved locally ✅");
    setTimeout(() => setMessage(""), 2500);
  };

  const clearDraft = () => {
    localStorage.removeItem("cv_draft");
    setData(initialData);
    setMessage("Draft cleared");
    setTimeout(() => setMessage(""), 2000);
  };

  const downloadPDF = async () => {
    if (!data.name?.trim()) {
      setMessage("Name is required."); return;
    }
    if (!data.email?.trim()) {
      setMessage("Email is required."); return;
    }

    const input = componentRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.name || "cv"}.pdf`);
  };

  return (
    <div className="makecv-page">
      <div className="makecv-form">
        <h1>Build Your CV</h1>

        <label>Choose Template</label>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          {Array.from({ length: 15 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Template {i + 1}
            </option>
          ))}
        </select>

        <label>Full Name *</label>
        <input value={data.name} onChange={handleChange("name")} />

        <label>Email *</label>
        <input value={data.email} onChange={handleChange("email")} type="email" />

        <label>Phone</label>
        <input value={data.phone} onChange={handleChange("phone")} />

        <label>LinkedIn Profile ID (e.g., john-doe)</label>
        <input
          value={data.linkedin}
          onChange={handleChange("linkedin")}
          placeholder="your-linkedin-username"
        />

        <label>Summary</label>
        <textarea value={data.summary} onChange={handleChange("summary")} />

        <hr />
        <h3>Education *</h3>
        {data.education.map((ed, i) => (
          <div className="block" key={i}>
            <select
              value={ed.level}
              onChange={(e) => setEducationField(i, "level", e.target.value)}
            >
              <option value="">Select Level</option>
              <option>Schooling</option>
              <option>Graduation</option>
              <option>Post Graduation</option>
              <option>Other</option>
            </select>
            <input
              placeholder="Degree / Course"
              value={ed.degree}
              onChange={(e) => setEducationField(i, "degree", e.target.value)}
            />
            <input
              placeholder="Institute"
              value={ed.institute}
              onChange={(e) => setEducationField(i, "institute", e.target.value)}
            />
            <input
              placeholder="Year"
              value={ed.year}
              onChange={(e) => setEducationField(i, "year", e.target.value)}
            />
            <input
              placeholder="Percentage / Grade"
              value={ed.percentage}
              onChange={(e) => setEducationField(i, "percentage", e.target.value)}
            />
            <select
              value={ed.status}
              onChange={(e) => setEducationField(i, "status", e.target.value)}
            >
              <option value="">Status</option>
              <option>Completed</option>
              <option>Ongoing</option>
              <option>Pursuing</option>
            </select>
            <button
              onClick={() => removeEducation(i)}
              disabled={data.education.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={addEducation}>+ Add Education</button>

        <hr />
        <h3>Experience / Projects</h3>
        {data.experience.map((ex, i) => (
          <div className="block" key={i}>
            <input
              placeholder="Title"
              value={ex.title}
              onChange={(e) => setExperienceField(i, "title", e.target.value)}
            />
            <input
              placeholder="Company / Project"
              value={ex.company}
              onChange={(e) => setExperienceField(i, "company", e.target.value)}
            />
            <input
              placeholder="Duration"
              value={ex.duration}
              onChange={(e) => setExperienceField(i, "duration", e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={ex.desc}
              onChange={(e) => setExperienceField(i, "desc", e.target.value)}
            />
            <button
              onClick={() => removeExperience(i)}
              disabled={data.experience.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={addExperience}>+ Add Experience</button>

        <hr />
        <h3>Certifications / Achievements</h3>
        {data.certifications.map((cert, i) => (
          <div className="block" key={i}>
            <input
              placeholder="Certification Name"
              value={cert.name}
              onChange={(e) => setCertificationField(i, "name", e.target.value)}
            />
            <input
              placeholder="Issuer / Organization"
              value={cert.issuer}
              onChange={(e) =>
                setCertificationField(i, "issuer", e.target.value)
              }
            />
            <input
              placeholder="Year"
              value={cert.year}
              onChange={(e) => setCertificationField(i, "year", e.target.value)}
            />
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => handleCertFile(i, e.target.files[0])}
            />
            <button
              onClick={() => removeCertification(i)}
              disabled={data.certifications.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={addCertification}>+ Add Certification</button>

        <hr />
        <label>Skills (comma separated)</label>
        <input value={data.skills} onChange={handleChange("skills")} />

        <label>Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0] || null)}
        />

        <div className="form-actions">
          <button onClick={saveDraft}>Save Draft</button>
          <button onClick={clearDraft}>Clear Draft</button>
          <button onClick={downloadPDF} className="primary">
            Generate & Download PDF
          </button>
        </div>

        {message && <div className="message">{message}</div>}
      </div>

      <div className="makecv-preview" ref={componentRef}>
        <CVTemplate data={data} photoUrl={photoUrl} template={template} />
      </div>
    </div>
  );
}
