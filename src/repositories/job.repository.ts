import { AppDataSource } from "../data-source";
import { Notification_Form } from "../entity/Notification_Form";

export const NF_Repository = AppDataSource.getRepository(Notification_Form);