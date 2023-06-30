import { Notification_Form } from "../entity/Notification_Form";
import { NF_Repository } from "../repositories/job.repository"

interface Query {
    nfId?: number
    placementCycleId?: number
}

export const findAll = async () : Promise<Notification_Form[] | null> => {
    return await NF_Repository.find();
}

export const findByQuery = async (query: Query) : Promise<Notification_Form | null> => {
    return await NF_Repository.findOne({ where: query });
}

export const fetchNF = async (nfId: number): Promise<Notification_Form | null> => {
    return await NF_Repository.findOneBy({ nfId });
}

export const createNF = async (nf: Notification_Form): Promise<Notification_Form> => {
    return await NF_Repository.save(nf);
}

export const updateNF = async (nfId: number, nf: Notification_Form): Promise<Notification_Form | null> => {
    const updatedNF = { ...nf, updatedAt: new Date() };
    await NF_Repository.update({ nfId }, updatedNF);
    return await fetchNF(nfId);
}

export const removeNF = async (nfId: number): Promise<Notification_Form | null> => {
    const nf = await NF_Repository.findOneBy({ nfId });

    if(nf)
    await NF_Repository.softDelete(nfId);

    return nf;
}
