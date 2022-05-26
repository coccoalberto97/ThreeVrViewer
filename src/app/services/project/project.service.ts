import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { VRViewerAction, VrViewerActionType, VrViewerEventType } from 'src/utils/vr-viewer-event';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }


  /**
   * return the project if it exists
   * @param projectId 
   */
  public getProject(projectId: number) {
    return of(this.$project);
  }


  /**
 * Mocked for dev
 */
  private $project = {
    events: [
      {
        eventTime: 100, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(0, VrViewerActionType.REMOVE_TEXT, { id: 4 })
        ]
      },
      {
        eventTime: 90, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.REMOVE_TEXT, { id: 3 })
        ]
      },
      {
        eventTime: 80, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.REMOVE_TEXT, { id: 2 })
        ]
      },
      {
        eventTime: 70, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.REMOVE_TEXT, { id: 1 })
        ]
      },
      {
        eventTime: 60, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.REMOVE_TEXT, { id: 0 })
        ]
      },
      {
        eventTime: 40, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.PLACE_TEXT, { id: 4 })
        ]
      },
      {
        eventTime: 30, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.PLACE_TEXT, { id: 3 })
        ]
      },
      {
        eventTime: 20, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.PLACE_TEXT, { id: 2 })
        ]
      },
      {
        eventTime: 10, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.PLACE_TEXT, { id: 1 })
        ]
      },
      {
        eventTime: 0, eventType: VrViewerEventType.TIME_EVENT, actions: [
          new VRViewerAction(1, VrViewerActionType.PLACE_TEXT, { id: 0 })
        ]
      },
    ],

    objects: {
      0: {
        id: 0,
        start: 0,
        end: 70,
        text: "lallo lallo 0",
        position: {
          x: -81.76898440591981, y: 32.43497796255248, z: 45.42191008790865
        },
        forward: {
          x: 0.5112543172401928, y: -0.1489415104252354, z: -0.8464250998024067
        },
      },
      1: {
        id: 1,
        start: 10,
        end: 80,
        text: "lallo 1",
        position: {
          x: -81.49436462932209, y: 32.459769899035656, z: 45.89207944976438
        },
        forward: {
          x: 0.7979064758198647, y: -0.14180831519662634, z: -0.5858631730923338
        }
      },
      2: {
        id: 2,
        start: 20,
        end: 90,
        text: "lallo 2",
        position: {
          x: -81.37121771176167, y: 32.409543018035436, z: 46.14532554274652
        },
        forward: {
          x: 0.9206372814263909, y: -0.19137753658826726, z: -0.34029639218955976
        }
      },
      3: {
        id: 3,
        start: 30,
        end: 100,
        text: "lallo 3",
        position: {
          x: -97.82089936472289, y: 14.528765938748238, z: 4.606680859803569
        },
        forward: {
          x: 0.9435684883285299, y: 0.14060411889081625, z: 0.29984827760777694
        }
      },
      4: {
        id: 4,
        start: 40,
        end: 110,
        text: "lallo 4",
        position: {
          x: -48.69667571463721, y: 19.168858312545538, z: -84.04135371622434
        },
        forward: {
          x: -0.08659551256653876, y: 0.19806983471034031, z: 0.9763552415904556
        }
      },
      5: {
        id: 5,
        start: 50,
        end: 120,
        text: "lallo 5",
        position: {
          x: 92.79439750146376, y: 16.13561985451155, z: 30.494628820781646
        },
        forward: {
          x: -0.8672143236533185, y: 0.02980699970046286, z: -0.49704211050913377
        }
      },
      6: {
        id: 6,
        start: 60,
        end: 130,
        text: "lallo 6",
        position: {
          x: 92.82596380195552, y: 15.923015521336636, z: 30.51159912990048
        },
        forward: {
          x: -0.7473567672310024, y: -0.18409831002877394, z: -0.6384087050773782
        }
      },
      7: {
        id: 7,
        start: 70,
        end: 140,
        text: "lallo 7",
        position: {
          x: 92.85212833337951, y: 16.272244507273776, z: 30.25274431899848
        },
        forward: {
          x: -0.6274390430099663, y: 0.12156243900990847, z: -0.7691182098537909
        }
      },
      8: {
        id: 8,
        start: 80,
        end: 150,
        text: "lallo 8",
        position: {
          x: 62.213661628113854, y: 10.57167515419713, z: 76.28098351810549
        },
        forward: {
          x: -0.38287631920562226, y: -0.06622467100920251, z: -0.9214228221296006
        }
      },
      9: {
        id: 9,
        start: 90,
        end: 160,
        text: "lallo 9",
        position: {
          x: 62.094877030635935, y: 10.391792513228923, z: 76.40444861492817
        },
        forward: {
          x: -0.10654830389734493, y: -0.10184384323523697, z: -0.9890780002263097
        }
      }
    }
  }
}
