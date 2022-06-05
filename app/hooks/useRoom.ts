import constructURI from "../utils/constructURI";
import fetchPost from "../utils/fetchPost";

const useRoom = () => {
    const createRoom = async () => {
        const response: { roomID: string } = await fetchPost(constructURI('new-room'), {});
        return response;
    }

    const joinRoom = async (roomID: string, playerName: string) => {
        const response: { myID: string, roomID: string } = await fetchPost(constructURI('enter-room'), { roomID, playerName });
        return response;
    }

    return {
        createRoom,
        joinRoom
    };
}

export default useRoom;