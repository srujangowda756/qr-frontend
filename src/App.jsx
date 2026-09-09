import { useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/generate";

function App() {
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          file_name: fileName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong while creating the QR code.",
        );
      }

      setQrImage(data.image_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = qrImage.split("/").pop() || "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="page-shell">
      <section className="generator-card">
        <div className="heading-block">
          <p className="eyebrow">QR generator</p>
          <h1>Create a QR code in seconds</h1>
        </div>

        <form onSubmit={handleSubmit} className="generator-form">
          <label>
            Website or text
            <input
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              required
            />
          </label>

          <label>
            File name
            <input
              type="text"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              placeholder="example-image"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate QR code"}
          </button>
        </form>

        {error && <p className="status error">{error}</p>}

        <div className="preview-box">
          {qrImage ? (
            <>
              <img src={qrImage} alt="Generated QR code" className="qr-image" />
              <button
                type="button"
                className="download-button"
                onClick={handleDownload}
              >
                Download QR
              </button>
            </>
          ) : (
            <p className="placeholder">
              Your QR code preview will appear here.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
