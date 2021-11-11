import React from "react";

export const PicturePreview = ({ file, filename, isUploading, imgUrl }) => {
    return (
        <div className="pic-preview">
            <img src = { file ? (!isUploading ? imgUrl : URL.createObjectURL(file)) : null } alt={file? filename : null} />
        </div>
    );
}