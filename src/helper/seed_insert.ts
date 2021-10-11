import {Knex} from "knex";

interface Data {
    [key: string]: string | number;
}

export async function insertIfNotExist(tableName: string, datas: Data[], knex: Knex, updateExistingData = false): Promise<void> {
    const idLists = datas.map(it => it.id);
    const existingDatas = await knex(tableName).whereIn("id", idLists);

    const newDatas = datas.filter((dataRow) => {
        const row = existingDatas.find(it => it.id === dataRow.id);

        return !row;
    });

    if (updateExistingData) {
        const existingDataUpdate = datas.filter((dataRow) => {
            const row = existingDatas.find(it => it.id === dataRow.id);

            return !!row;
        });

        await Promise.all(existingDataUpdate.map(async existingData => knex(tableName).update(existingData).where({
            id: existingData.id,
        })));
    }

    await knex(tableName).insert(newDatas);
}
