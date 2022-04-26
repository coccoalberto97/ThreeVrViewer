import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import bind from 'bind-decorator';
import { OrbitControls } from 'src/utils/orbit-controls';
import { Stack } from 'src/utils/stack';
import { IVrViewerEvent, IVrViewerPlacedObject, VRViewerAction, VrViewerActionType, VrViewerEvent, VrViewerEventType } from 'src/utils/vr-viewer-event';
import { Color, Mesh, MeshBasicMaterial, MOUSE, Object3D, PerspectiveCamera, Raycaster, Scene, SphereGeometry, Vector2, Vector3, VideoTexture, WebGLRenderer } from 'three';
import { Block, Text, update } from 'three-mesh-ui';
import { ThreeVrVideoComponent } from '../support/three-vr-video/three-vr-video.component';

@Component({
  selector: 'three-vr-viewer-main',
  templateUrl: './three-vr-viewer.component.html',
  styleUrls: ['./three-vr-viewer.component.scss']
})
export class ThreeVrViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  @ViewChild(ThreeVrVideoComponent, { static: true }) public vrVideoComponent!: ThreeVrVideoComponent;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @Input() public fieldOfView: number = 75;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1100;

  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private raycaster = new Raycaster();

  //userInteraction

  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  private mouse: Vector2 = new Vector2(0, 0);

  //event handling
  private lastTimeUpdate: number = 0;
  //utilizzare 2 stack per gestire gli eventi
  //quando un evento viene eseguito va pushato sullo stack di quelle eseguite
  //se il tempo del video torna indietro bisogna pushare nuvoamente nella lista di quelle da eseguire
  private toViewElements: Stack<IVrViewerEvent> = new Stack<VrViewerEvent>();
  private viewedElements: Stack<IVrViewerEvent> = new Stack<VrViewerEvent>();
  private interactableObjects: Array<Object3D> = [];

  //map containing all assets
  private project = {
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
        text: "lallo 0",
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

  private activeObjects: Array<IVrViewerPlacedObject> = [];
  constructor() { }

  ngOnInit(): void {
    let events = this.project.events;


    for (let event of events) {
      this.toViewElements.push(event);
    }
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }

  /* don't need this anymore but keep it for reference for the moment
  @HostListener('mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / this.canvas.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
  }*/

  @HostListener('mousedown', ['$event'])
  protected onMouseDown(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (event.button === MOUSE.RIGHT) {
      let spawnPosition: Vector3 = new Vector3(this.mouse.x, this.mouse.y, -1).unproject(this.camera);
      //working with clones to not modify the camera position
      let objectPositionClone: Vector3 = new Vector3(spawnPosition.x, spawnPosition.y, spawnPosition.z);
      let cameraPositionClone: Vector3 = new Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      //forward vector to place the object in front of the camera
      let forward: Vector3 = objectPositionClone.sub(cameraPositionClone).normalize();
      /* debug object
      var sphere = new Mesh(new SphereBufferGeometry(16, 4, 4), new MeshBasicMaterial({
        color: "yellow",
        wireframe: true
      }));
      sphere.position.copy(spawnPosition);
      sphere.position.add(forward.clone().multiplyScalar(490));
      this.scene.add(sphere);*/
      this.addText(spawnPosition, forward, 490, "lallo");
      let obj = localStorage.getItem("SAVED_OBJECTS") ? JSON.parse(localStorage.getItem("SAVED_OBJECTS")!) : [];
      obj.push({ position: spawnPosition, forward: forward });
      localStorage.setItem("SAVED_OBJECTS", JSON.stringify(obj));
    } else if (event.button === MOUSE.LEFT) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      //check for interactable objects clicked
      const intersects = this.raycaster.intersectObjects(this.interactableObjects);
      for (let i = 0; i < intersects.length; i++) {
        //test to remvoe
        /*let obj = this.interactableObjects.find((o) => {
          return o.id == intersects[i].object.id
        });
        if (obj) {
          StaticUtils.removeObject3D(obj);
        }*/
        //get object from cache map and execute the connected event
        //console.log(intersects[i]);
      }
    }
  }

  /**
   * Create the scene
   */
  private createScene() {
    //* Scene
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);
    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );

    let videoGeometry = new SphereGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    videoGeometry.scale(- 1, 1, 1);
    const texture = new VideoTexture(this.vrVideoComponent.video);
    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new Mesh(videoGeometry, material);
    this.scene.add(mesh);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05;

    this.controls.rotateSpeed = 0.1;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 1000;
    this.controls.enablePan = false;
    this.controls.enableZoom = true;

    this.controls.maxPolarAngle = Math.PI;
    this.render();
  }

  /**
   * Render loop for threeJs
   * I use the bind decorator to stick it to ThreeVrViewerComponent context in a clean an understandable way
   */
  @bind
  private render() {
    requestAnimationFrame(this.render);
    update();
    this.handleEvents();
    if (typeof this.controls != 'undefined') {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Function to check whenever the currentTime of the video is greater than top element of the scheduled events
   */
  private handleEvents() {
    let currentTime = this.vrVideoComponent.getCurrentTime();
    //the video is either still or has moved forward
    if (currentTime >= this.lastTimeUpdate) {
      let top = this.toViewElements.top;
      while (top && top.value && top.value.eventTime < currentTime) {
        //todo put in a class
        switch (top.value.eventType) {
          case VrViewerEventType.TIME_EVENT:
            for (let action of top.value.actions) {
              switch (action.actionType) {
                case VrViewerActionType.PLACE_TEXT:
                  let id = action.payload.id as number;
                  let obj = (this.project.objects as any)[id];
                  if (obj) {
                    let position = new Vector3(obj.position.x, obj.position.y, obj.position.z);
                    let forward = new Vector3(obj.forward.x, obj.forward.y, obj.forward.z);
                    let place_text_object = this.addText(position, forward, 490, obj.text);
                    this.activeObjects.push({ id: obj.id, action: action, object: place_text_object, start: obj.start, end: obj.end });
                  }
                  break;
                case VrViewerActionType.REMOVE_TEXT:
                  let remove_text_object = this.activeObjects.find((ob) => ob.id == action.payload.id);
                  if (remove_text_object) {
                    remove_text_object.object.removeFromParent();
                    this.activeObjects = this.activeObjects.filter((obj) => obj.id != action.payload.id);
                  }
                  break;
                default:
                  break;
              }
            }

            break;
          default:
            break;
        }

        //console.log(top.value.payload);
        //put the viewed element on top of the viewed stack
        this.viewedElements.push(top.value);
        this.toViewElements.pop();
        top = this.toViewElements.top;
      }
    } else {
      //the video has moved back
      let top = this.viewedElements.top;
      while (top && top.value && top.value.eventTime >= currentTime) {
        //console.log(top.value.payload);
        //put the viewed element on top of the viewed stack
        this.toViewElements.push(top.value);
        this.viewedElements.pop();
        top = this.viewedElements.top;
      }
      let objectsToRemove: number[] = [];
      for (let activeObject of this.activeObjects) {
        if (activeObject.start >= currentTime) {
          activeObject.object.removeFromParent();
          objectsToRemove.push(activeObject.object.id);
        }
      }

      this.activeObjects = this.activeObjects.filter((obj) => objectsToRemove.indexOf(obj.object.id) < 0);
    }
    this.lastTimeUpdate = currentTime;
  }

  /**
   * Redraw on resize
   */
  public draw() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  /**
   * Add a text object in the specified position
   * @param position 
   * @param textContent 
   */
  private addText(position: Vector3, forward: Vector3, distance: number, textContent: string, lookAt?: Vector3): Object3D {
    const container = new Block({
      width: 100,
      height: 100,
      padding: 1,
      backgroundColor: new Color(0xffffff),
      backgroundOpacity: 0.5,
      bestFit: "auto",
      fontFamily: './assets/Roboto-msdf.json',
      fontTexture: './assets/Roboto-msdf.png',

    });

    const textObject = new Text({
      content: textContent,
      fontColor: new Color(0x000000),
      fontSize: 10,

    });
    container.add(textObject);
    container.position.copy(position);
    container.position.add(forward.clone().multiplyScalar(distance));
    container.lookAt(lookAt ?? this.camera.position);
    // scene is a THREE.Scene (see three.js)
    this.scene.add(container);
    return container;
  }
}
