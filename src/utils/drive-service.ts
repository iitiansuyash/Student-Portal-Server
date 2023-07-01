import { google } from 'googleapis';
import * as fs from 'fs';
import { NextFunction, Request, Response } from "express";
import { Document } from '../entity/Document';
import { AppDataSource } from '../data-source';
import { env } from '../config';

const clientId = env.drive.clientId;
const clientSecret = env.drive.clientSecret;
const redirectURI = env.drive.redirectURI;

const refreshToken = env.drive.refreshToken;

const oAuth2Client = new google.auth.OAuth2( clientId, clientSecret, redirectURI );

oAuth2Client.setCredentials({ refresh_token: refreshToken });

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
})

interface UploadRequest extends Request {
    file: {
        path: string,
        field: string,
        originalname: string
    }
}

interface UploadResponse {
    data: {
        id: string,
        name: string,
        mimeType: string,
    }
}

export const uploadFile = async (req: UploadRequest, res: Response, next: NextFunction) => {
    const filePath = req.file.path;
    try {
        const response = await drive.files.create({
            requestBody: {
                name: req.file.originalname || `File-${Date.now()}`,
                mimeType: 'application/pdf'
            },
            media: {
                mimeType: 'application/pdf',
                body: fs.createReadStream(filePath),
            }
        }) as UploadResponse;

        const document = new Document();
        document.id = response?.data?.id;
        document.name = response?.data?.name;
        document.mimeType = response?.data?.mimeType;
        document.previewLink = await generatePreviewUrl(response?.data?.id);
        document.downloadLink = await generateDownloadUrl(response?.data?.id);

        const newDocument = await AppDataSource.getRepository('Document').save(document);

        res.status(201).json({ success: true, document: newDocument });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

export const deleteFile = async (req, res, next) => {
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

export const generatePreviewUrl = async (fileId: string) => {
    try {
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

        return result.data.webViewLink;
    } catch (error) {
        return error;
    }
}

export const generateDownloadUrl = async (fileId: string) => {
    try {
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

    return result.data.webContentLink;
    } catch (error) {
        return error;
    }
}