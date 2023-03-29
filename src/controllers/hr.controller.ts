import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { HR_contact, ValidityState } from "../entity/Hr_contact";
import { Hr_contact_emails } from "../entity/Hr_contact_emails";
import { Hr_contact_phones } from "../entity/Hr_contact_phones";

interface HR_Phone {
    hrId?: number,
    phonePref: string,
    phone: string
}

export const createHR = async (req: Request, res: Response, next: NextFunction) : Promise<HR_contact | void> => {
    try {
        const hr = req.body;
        const newHr = new HR_contact();
        newHr.hrContactName = hr.name;
        newHr.validityState = ValidityState.VALID;
        newHr.emails = hr.emails?.map((email: string) => {
            const newEmail = new Hr_contact_emails();
            newEmail.email = email;
            return newEmail
        })
        newHr.phones = hr.phones?.map((item: HR_Phone) => {
            const newPhone = new Hr_contact_phones();
            newPhone.phone = item.phone;
            newPhone.phonePref = item.phonePref;
            return newPhone;
        })
        newHr.linkedin = hr.linkedin;

        const HR = await AppDataSource.getRepository(HR_contact).save(newHr);

        res.status(201).json({ success: true, HR });
    } catch (error) {
        return next(error);
    }
}