import React, {useEffect, useState} from 'react';
import {styled} from '@mui/system';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageContainer = styled(Box)({
    position: 'relative',
    width: '100%',
    height: '100%',
    '&:hover $imageActions': {
        display: 'block',
    },
});

const EditableImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const ImageActions = styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

const StyledButton = styled(Button)({
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 10,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
});

const FileInput = styled('input')({
    display: 'none',
});

function ImageWithHover({imageKey, parcelaId, defaultImage}) {
    const [hovered, setHovered] = useState(false);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const filename = `${imageKey}.jpeg`

    useEffect(() => {
            const fetchImage = async () => {
                try {
                    const response = await fetch(`/api/s3/image/download?file=${filename}&parcelaId=${parcelaId}`);
                    const {url} = await response.json();
                    setImage(url)
                } catch (error) {
                    console.error(`Failed to fetch image from API: ${error}`);
                }
            };
            fetchImage();
        },
        //   [apiUrl]);
        [parcelaId]);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const handleEdit = () => {
        // Open the file input dialog
        document.getElementById(`file-input-${imageKey}`).click();
    };

    const handleDelete = () => {
        setFile(null);
        handleImageError()
    };

    const handleImageError = async () => {
        try {
            const response = await fetch(`/api/s3/image/download?file=default.jpeg&parcelaId=default`);
            const {url} = await response.json();
            setImage(url)
        } catch (error) {
            console.error(`Failed to fetch image from API: ${error}`);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            // Upload the file to the server
            console.log(parcelaId)
            console.log("PUTAS")
            console.log(filename)
            const fileType = file.type
            const res = await fetch(
                `/api/s3/image/upload?file=${filename}&fileType=${fileType}&parcelaId=${parcelaId}`
            )
            const {url} = await res.json()
            const upload = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {"Content-Type": fileType}
            })
            if (upload.ok) {
                const response = await fetch(`/api/s3/image/download?file=${filename}&parcelaId=${parcelaId}`);
                const {url} = await response.json();
                setImage(url);
            } else {
                console.error('Upload failed.')
            }
            const s3FileUrl = `https://<S3_BUCKET_NAME>.s3.us-west-2.amazonaws.com/${filename}`
            console.log('File URL', s3FileUrl)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ImageContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <EditableImage src={image}  onError={handleImageError} alt="Your image"/>
            {hovered && (
                <ImageActions className="imageActions">
                    <ButtonGroup disableElevation variant="contained">
                        <StyledButton onClick={handleEdit} disabled={isUploading}>
                            {isUploading ? 'Uploading...' : 'Edit'}
                        </StyledButton>
                        <StyledButton onClick={handleDelete} disabled={isUploading}>
                            Delete
                        </StyledButton>
                    </ButtonGroup>
                </ImageActions>
            )}
            <FileInput type="file"  id={`file-input-${imageKey}`} onChange={handleFileChange}/>
        </ImageContainer>
    );
}

export default ImageWithHover;
