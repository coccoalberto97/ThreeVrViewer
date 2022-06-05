import { IVrViewerEvent } from "./vr-viewer-event";

export interface Project {
    events: IVrViewerEvent[];
    objects: { [objectId: number]: any };
}