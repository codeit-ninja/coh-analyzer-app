import { loadModule, authProvider } from '@/modules/core.module';
import { ref, Ref } from '@vue/reactivity';
import { iLobby } from './lobby';

export type MatchHistoryOptions = {
    filter?: { [key: string]: any }
}

export const match: Ref<iLobby|undefined> = ref(undefined);
export const archive: Ref<any> = ref([]);

export async function getMatchHistory(options?: MatchHistoryOptions) {
    const auth = await authProvider();
    const ref = loadModule('firebase').firestore
        .collection('users')
        .doc(auth.steamId.toString())
        .collection('matches')

    let query;

    if(options?.filter?.outcome !== 'all' && options?.filter?.type === 'all') {
        query = ref.where('outcome', '==', options?.filter?.outcome);
    } 
    else if(options?.filter?.type !== 'all' && options?.filter?.outcome === 'all') {
        query = ref.where('type', '==', options?.filter?.type);
    } 
    else if(options?.filter?.outcome !== 'all' && options?.filter?.type !== 'all') {
        query = ref.where('outcome', '==', options?.filter?.outcome).where('type', '==', options?.filter?.type);
    } 
    else {
        query = ref.orderBy('date', options?.filter?.date || 'desc');
    }

    query.onSnapshot(snapshot => {
        archive.value = snapshot.docs.map(doc => doc.data());
    })
}

export async function getCurrentMatch() {
    const auth = await authProvider();
    const ref = loadModule('firebase').firestore
        .collection('users')
        .doc(auth.steamId.toString())
        .collection('matches')
        .doc('current-match')

    ref.onSnapshot(snapshot => {
        const data = snapshot.data();
        if( ! data ) return;

        match.value = data as iLobby;
    })
}