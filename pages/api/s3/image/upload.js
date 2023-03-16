import {getServerSession} from "next-auth/next"
import S3 from 'aws-sdk/clients/s3'
import {authOptions} from "./../../auth/[...nextauth]"


export default async function handler(
    req,
    res
) {
    const session = await getServerSession(req, res, authOptions)

    if (session.user.email)
        //email is "IS ADMIN" and image is "ADDRESS"
    {
        const imgType = req.query.fileType.split("/")[1];

        console.log(req.query.parcelaId)
        const s3 = new S3({
            signatureVersion: 'v4',
            region: 'us-east-1',
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        })

        const preSignedUrl = s3.getSignedUrl("putObject", {
            Bucket: process.env.BUCKET_NAME,
            Key: 'parcela-' + req.query.parcelaId + '/' + req.query.file,
            //todo we need to change jpeg to dynamic swithcing but for that we need to change front
            ContentType: req.query.fileType,
            Expires: 5 * 60
        })
        console.log(preSignedUrl)
        res.status(200).json({
            "url": preSignedUrl
        })
    }
}