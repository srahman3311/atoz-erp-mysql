import React from "react";

export const ImageUploader = ({ isUploading, imgUrl, file, filename, fileHandler }) => {
    return (
        <div className="image-uploader">
            <div className="upload-container">
                <div className="upload-content">
                    <div className="image-preview">
                        <img src = { file ? (!isUploading ? imgUrl : URL.createObjectURL(file)) : null } alt={file? file.name : null} />
                    </div>
                    <div className="image-file-input">
                        <input type="file" onChange={fileHandler} title=""/>
                        <span className="image-filename">{ file === null ? "No File Selected" : filename}</span>
                        <p className="image-upload-button">Choose File</p>
                    </div>
                </div>
            </div>
        </div>
    )
}































/*
export const ImageUploader = ({ file, filename, fileHandler}) => {
    return (
        <div className="image-uploader">
            <div className="upload-container">
                <div className="image-preview">
                    <img src={file ? URL.createObjectURL(file) : null} 
                    alt={file? file.name : null} 
                    />
                </div>
                <div className="image-file-input">
                    <input type="file" onChange={fileHandler} title=""/>
                    <span className="image-filename">{ file === null ? "No File Selected" : filename}</span>
                    <span className="image-upload-button">Choose File</span>
                </div>
            </div>
        </div>
    )
}
*/
