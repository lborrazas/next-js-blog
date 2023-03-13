import S3 from 'aws-sdk/clients/s3'
import {getServerSession} from "next-auth/next"
import {authOptions} from "./../../auth/[...nextauth]"

export default async function handler(
    req,
    res
) {
    const session = await getServerSession(req, res, authOptions)
    if (session.user.email || session.user.image == req.query.address) {
        const s3 = new S3({
            signatureVersion: 'v4',
            region: 'us-east-1',
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        })

        const preSignedUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.BUCKET_NAME,
            Key: `${req.query.address}/${req.query.file}`,
            ContentType: req.query.fileType,
            Expires: 5 * 60
        })
        res.status(200).json({
            "url": preSignedUrl
        })
    }
}