"use client";

import type { ReactNode } from "react";

const stub = (_props: Record<string, unknown>) => null;
const Pass = ({ children }: { children?: ReactNode }) => <>{children}</>;

export const LiveKitRoom = Pass;
export const VideoConference = stub;
export const RoomAudioRenderer = stub;
export const ControlBar = stub;
export const ParticipantTile = stub;
export const useTracks = () => [];
export const LayoutContextProvider = Pass;
export const Chat = stub;
export const ChatToggle = stub;
export const DisconnectButton = stub;
export const FocusLayout = Pass;
export const FocusLayoutContainer = Pass;
export const GridLayout = Pass;
export const ParticipantLoop = Pass;
