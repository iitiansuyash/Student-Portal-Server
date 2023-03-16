import { google } from 'googleapis';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { NextFunction, Response } from "express";

dotenv.config();

const clientId = process.env.DRIVE_CLIENT_ID;
const clientSecret = process.env.DRIVE_CLIENT_SECRET;
const redirectURI = process.env.DRIVE_REDIRECT_URI;

const refreshToken = process.env.DRIVE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2( clientId, clientSecret, redirectURI );

oAuth2Client.setCredentials({ refresh_token: refreshToken });

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
})

// const filePath = path.join(__dirname, 'bg.jpg');

exports.uploadFile = async (req: { file: { path: string }}, res: Response, next: NextFunction) => {
    const filePath = req.file.path;

    try {
        const response = await drive.files.create({
            requestBody: {
                name: `file-${Date.now()}`,
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath),
            }
        });

        res.status(201).json({ success: true, data: response.data });
    } catch (error) {
        return next(error);
    }
}

exports.deleteFile = async (req, res, next) => {
    const { id } = req.params;

    try {
        await drive.files.delete({
            fileId: id
        });

        res.status(201).json({ success: true, message: 'File deleted successfully'});
    } catch (error) {
        return next(error);
    }
}

exports.generatePreviewUrl = async (req, res, next) => {
    try {
        const fileId = req.params.id;

        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        const result = await drive.files.get({
            fileId,
            fields: 'webViewLink'
        });

        res.status(201).json({ previewLink: result.data.webViewLink });
    } catch (error) {
        return next(error);
    }
}

exports.generateDownloadUrl = async (req, res, next) => {
    try {
        const fileId = req.params.id;

        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        const result = await drive.files.get({
            fileId,
            fields: 'webContentLink'
        });

    res.status(201).json({ downloadLink: result.data.webContentLink });
    } catch (error) {
        return next(error);
    }
}