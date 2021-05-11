import config from '@/config';
import fs from 'fs-extra';
import { loadModule } from '@/modules/core.module';
import Zip from 'adm-zip';
import { v4 as uuidv4 } from 'uuid';

export class Replay {
    #zip = new Zip();

    #uid =  uuidv4();

    #file: any;

    /**
     * Public download URL
     * 
     * @returns string
     */
    public downloadUrl?: string;

    constructor(path: string) {
        if( ! fs.existsSync(path) ) {
            throw new Error('Cannot find replay ' + path);
        }
        
        this.#zip.addLocalFile(path)
        this.#file = this.#zip.toBuffer();
    }

    /**
     * Upload replay file to firestore cloud
     * 
     * @returns void
     */
    public async store() {
        const storageRef = loadModule('firebase').storage.ref();
        const replayRef = storageRef.child(this.#uid + '.zip');

        await replayRef.put(this.#file);
        this.downloadUrl = await replayRef.getDownloadURL();
    }

    /**
     * Uploads latest replay to firestore cloud
     * 
     * @returns Replay
     */
    public static async latest() {
        const replay = new Replay(config.playbackPath + '/temp.rec');
        await replay.store();

        return replay;
    }
}