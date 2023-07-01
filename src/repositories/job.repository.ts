import { AppDataSource } from "../data-source";
import { Notification_Form } from "../entity/Notification_Form";
import { NF_Applications } from "../entity/NF_Applications";

export const NF_Repository = AppDataSource.getRepository(Notification_Form);

export const NF_Applications_Repository = AppDataSource.getRepository(NF_Applications);