import { useState } from "react";

function MyComponent() {
    const [imageUrl, setImageUrl] = useState(null);

    const fetchImage = async () => {
        const filename = '3.jpeg'
        const response = await fetch(`/api/s3/image/download?file=${filename}&address=0xf3Df4889AA44E56c1DCB63b507911877A4630CFA`);
        const { url } = await response.json();
        setImageUrl(url);
    };

    return (
        <div>
            <button onClick={fetchImage}>Fetch Image</button>
            {imageUrl && <img src={imageUrl} alt="My Image" />}
        </div>
    );
}

export default MyComponent;

