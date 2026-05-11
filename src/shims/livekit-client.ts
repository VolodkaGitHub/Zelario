export class Room {
  connect = async () => {};
  disconnect = async () => {};
  on = () => this;
  off = () => this;
}

export const RoomEvent = {
  Connected: "connected",
  Disconnected: "disconnected",
  DataReceived: "dataReceived",
  TrackSubscribed: "trackSubscribed",
};

export const Track = { Source: { Camera: "camera", Microphone: "microphone" } };
export const DataPacket_Kind = { RELIABLE: 0 };

export type Participant = { identity: string; name?: string };
export type RemoteParticipant = Participant;
export type LocalParticipant = Participant;
