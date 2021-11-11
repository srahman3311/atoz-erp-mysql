import React from "react";

export const FileInput = ({ file, filename, fileHandler, isUploading, user }) => {
    return (
        <div className="pic-file-input">
            <input type="file" onChange = {fileHandler} />
            <span className="pic-filename">{ !isUploading ? filename : file.name}</span>
            <span className="pic-upload-button">Browse</span>
        </div>
    );
}