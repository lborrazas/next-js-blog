export default function casa(){

    const uploadPhoto = async (e, number) => {
        const fileInput = e.target;
        if (!fileInput.files || fileInput.files.length === 0) {
            throw new Error("No file selected.");
        }
        const file = fileInput.files[0];
        const filename = number//change to parameter
        const fileType = file.type
        const res = await fetch(
            `/api/s3/image/upload?file=${filename}&fileType=${fileType}&address=0xf3Df4889AA44E56c1DCB63b507911877A4630CFA`
        )
        const { url } = await res.json()
        const upload = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: { "Content-Type": fileType }
        })
        if (upload.ok) {
            console.log('Uploaded successfully!')
        } else {
            console.error('Upload failed.')
        }
        const s3FileUrl = `https://<S3_BUCKET_NAME>.s3.us-west-2.amazonaws.com/${filename}`
        console.log('File URL', s3FileUrl)
    }

    return (
        <>
            <p>Imagen 1</p>
            <input type="file" accept="image/png, image/jpeg"  onChange={(e) => uploadPhoto(e, 1)} />
            <p>Imagen 2</p>
            <input type="file" accept="image/png, image/jpeg"  onChange={(e) => uploadPhoto(e, 2)} />
            <p>Imagen 3 </p>
            <input type="file" accept="image/png, image/jpeg"  onChange={(e) => uploadPhoto(e, 3)} />
        </>
    );
}