import { useRef, useState } from "react";
import {
  FaPen,
  FaVideo,
  FaUpload,
  FaTimes,
  FaImage,
  FaLink,
  FaSmile,
} from "react-icons/fa";

export default function PostComposer({
  user = {name: "Você",initials: "VC",},
  onSubmit = () => {},
}) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  function isValidVideo(file) {
    return (
      file &&
      ["video/mp4", "video/quicktime"].includes(file.type)
    );
  }

  function handleFile(file) {
    if (isValidVideo(file)) {
      setVideoFile(file);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  const canSubmit =
    (mode === "text" && text.trim()) ||
    (mode === "video" && videoFile);

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({ mode, text, videoFile, });
    setText("");
    setVideoFile(null);

    if (fileInputRef.current)
      fileInputRef.current.value = "";
  }

  return (
    <div className="composer">
      <div className="composer-header">
        <div className="composer-avatar">
          {user.initials}
        </div>

        {mode === "text" ? (
          <input
            type="text"
            placeholder="O que você quer compartilhar?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <p>Envie um vídeo para a comunidade.</p>
        )}
      </div>

      <div className="composer-tabs">
        <button
          className={mode === "text" ? "active" : ""}
          onClick={() => setMode("text")}>
          <FaPen />
          Escrever
        </button>

        <button
          className={mode === "video" ? "active" : ""}
          onClick={() => setMode("video")}
        >
          <FaVideo />
          Vídeo
        </button>
      </div>

      {mode === "video" && (
        <div
          className={`composer-upload ${dragging ? "drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >

          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="video/mp4,video/quicktime"
            onChange={(e) =>
              handleFile(e.target.files[0])
            }/>

          {videoFile ? (
            <div className="composer-file">
              <FaVideo />
              <span>{videoFile.name}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoFile(null);
                }}>
                <FaTimes />
              </button>
            </div>
          ) : (
            <>
              <FaUpload className="upload-icon" />
              <p>
                Arraste um vídeo ou clique para selecionar.
              </p>
              <small>MP4 ou MOV • até 500MB</small>
            </>
          )}
        </div>
      )}

      <div className="composer-footer">
        <div className="composer-tools">
          <FaImage />
          <FaLink />
          <FaSmile />
        </div>

        <button
          className="composer-submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Publicar
        </button>
      </div>

      <style>{`
        .composer {
          background: #fff;
          border: 1px solid #dfe7df;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .composer-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .composer-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #e6f5e7;
          color: #2d8a43;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .composer-header input {
          flex: 1;
          border: none;
          background: #f6f8f6;
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 0.95rem;
          outline: none;
        }

        .composer-header p {
          color: #777;
          margin: 0;
        }

        .composer-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .composer-tabs button {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: white;
          cursor: pointer;
          transition: 0.25s;
          font-size: 0.9rem;
          color: #444;
        }

        .composer-tabs button:hover {
          background: #f5f7f5;
        }

        .composer-tabs button.active {
          border-color: #43a047;
          background: #eef8ef;
          color: #2d8a43;
        }

        .composer-upload {
          border: 2px dashed #b7cdb8;
          border-radius: 15px;
          padding: 45px;
          text-align: center;
          cursor: pointer;
          transition: 0.25s;
          margin-bottom: 20px;
        }

        .composer-upload.drag {
          border-color: #43a047;
          background: #eef8ef;
        }

        .upload-icon {
          font-size: 2rem;
          color: #43a047;
          margin-bottom: 15px;
        }

        .composer-upload p {
          margin: 0;
          color: #555;
        }

        .composer-upload small {
          display: block;
          color: #888;
          margin-top: 8px;
        }

        .composer-file {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }

        .composer-file button {
          border: none;
          background: none;
          cursor: pointer;
          color: #999;
          font-size: 1rem;
        }

        .composer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .composer-tools {
          display: flex;
          gap: 18px;
          font-size: 1.1rem;
          color: #6f7f70;
        }

        .composer-tools svg {
          cursor: pointer;
          transition: 0.2s;
        }

        .composer-tools svg:hover {
          color: #43a047;
        }

        .composer-submit {
          padding: 10px 22px;
          border: none;
          border-radius: 10px;
          background: #43a047;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s;
        }

        .composer-submit:hover {
          background: #2e7d32;
        }

        .composer-submit:disabled {
          background: #c8d2c8;
          cursor: not-allowed;
        }
      `}</style>

    </div>
  );
}