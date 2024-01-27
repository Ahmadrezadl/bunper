import { promises as fs } from 'fs';
import * as path from 'path';

class EasyBunData {
    private dataPath: string;

    constructor() {
        this.dataPath = path.join(__dirname, '..', 'easy-bun-data');
        this.initialize();
    }

    public setDataPath(path:string){
        this.dataPath = path;
        this.initialize();
    }

    private async initialize() {
        // Ensure the data directory exists
        try {
            await fs.mkdir(this.dataPath, { recursive: true });
        } catch (error) {
            console.error('Error creating data directory:', error);
        }
    }

    async saveData(collection: string, data: any): Promise<void> {
        const filePath = path.join(this.dataPath, `${collection}.json`);
        try {
            let jsonData = [];
            try {
                // Read the existing data file
                const fileData = await fs.readFile(filePath, 'utf8');
                jsonData = JSON.parse(fileData);
            } catch (error : any) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
                // If the file does not exist, jsonData is already an empty array
            }

            jsonData.push(data);
            // Write the updated data back to the file
            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
        } catch (error) {
            throw error;
        }
    }

    async getFirst(collection: string, query: any): Promise<object | null> {
        const filePath = path.join(this.dataPath, `${collection}.json`);
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            const jsonData = JSON.parse(fileData);
            // Find the first record matching the query
            const record = jsonData.find((item: any) =>
                Object.keys(query).every(key => item[key] === query[key])
            );
            return record || null;
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return null; // Return null if the file does not exist
            } else {
                throw error;
            }
        }
    }

    async deleteData(collection: string, query: any): Promise<void> {
        const filePath = path.join(this.dataPath, `${collection}.json`);
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            let jsonData = JSON.parse(fileData);
            // Filter out the records matching the query
            jsonData = jsonData.filter((item: any) =>
                !Object.keys(query).every(key => item[key] === query[key])
            );
            // Write the updated data back to the file
            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
        } catch (error : any) {
            if (error.code === 'ENOENT') {
                console.error('File not found:', filePath);
            } else {
                throw error;
            }
        }
    }
}

export const easybunData = new EasyBunData();
