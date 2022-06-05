import { Object3D } from "three";

export interface IVrViewerEvent {
    eventTime: number;
    eventType: VrViewerEventType;
    actions: IVrViewerAction[];
}

export interface IVrViewerAction {
    id: number;
    actionType: VrViewerActionType;
    /**
     * contains data for connected actions, for example a button payload may contain a event reference to change current time
     */
    payload: any;
}

export interface IVrViewerPlacedObject {
    id: number;
    action: IVrViewerAction,
    start: number,
    end: number;
    object: Object3D
}


export class VrViewerEvent implements IVrViewerEvent {
    eventTime: number;
    eventType: VrViewerEventType;
    actions: IVrViewerAction[];

    constructor(eventTime: number, eventType: VrViewerEventType, actions: IVrViewerAction[]) {
        this.eventTime = eventTime;
        this.eventType = eventType;
        this.actions = actions;
    }
}

export class VRViewerAction implements IVrViewerAction {
    id: number;
    actionType: VrViewerActionType;
    payload: any;

    constructor(id: number, actionType: VrViewerActionType, payload: any) {
        this.id = id;
        this.actionType = actionType;
        this.payload = payload;
    }
}

export enum VrViewerEventType {
    TIME_EVENT,
    CLICKABLE_EVENT
}

export enum VrViewerActionType {
    PLACE_OBJECT, //place object (clickable)
    REMOVE_OBJECT, //remove object
    PLACE_BUTTON,//place button (clickable)
    REMOVE_BUTTON,//remove button
    PLACE_TEXT,//place text
    REMOVE_TEXT,//remove text
    START_BGM,//start bgm
    STOP_BGM, //stop bgm
    SEEK //go to time
    //EXPERIMENTAL
    //loop can be achieved with go to time ()
}


//object to destroy should contain the start time have a separated array/ordered stack/ if time update < current time, check that array to remove unwanted objects