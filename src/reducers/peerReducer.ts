import { ADD_PEER, REMOVE_PEER } from "../actions/peerAction";

export type PeerState = Record<string, {stream: MediaStream}>;

type PeerAction = {
    type: typeof ADD_PEER,
    payload: {peerId: string, stream: MediaStream}
} | {
    type: typeof REMOVE_PEER,
    payload: {peerId: string}
}

export const peerReducer = (state: PeerState, action: PeerAction): PeerState => {
    switch (action.type){
        case ADD_PEER:
            return {
                ...state,
                [action.payload.peerId]: {
                    stream: action.payload.stream,
                }
            }
        case REMOVE_PEER:
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-case-declarations
            const { [action.payload.peerId]: _, ...newState } = state;
            return newState;
        default: 
            return {...state};
    }
}