import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import bind from 'bind-decorator';
import { lastValueFrom, Subject } from 'rxjs';
import { OrbitControls } from 'src/utils/orbit-controls';
import { Project } from 'src/utils/project';
import { Stack } from 'src/utils/stack';
import { IVrViewerEvent, IVrViewerPlacedObject, VRViewerAction, VrViewerActionType, VrViewerEvent, VrViewerEventType } from 'src/utils/vr-viewer-event';
import { Color, Mesh, MeshBasicMaterial, MOUSE, Object3D, PerspectiveCamera, Raycaster, Scene, SphereGeometry, Vector2, Vector3, VideoTexture, WebGLRenderer } from 'three';
import { Block, Text, update } from 'three-mesh-ui';
import { ProjectService } from '../services/project/project.service';
import { ThreeVrVideoComponent } from '../support/three-vr-video/three-vr-video.component';

@Component({
  selector: 'three-vr-viewer-main',
  templateUrl: './three-vr-viewer.component.html',
  styleUrls: ['./three-vr-viewer.component.scss']
})
export class ThreeVrViewerComponent implements OnInit, AfterViewInit, OnDestroy {
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
  private interactableObjects: Object3D[] = [];

  //map containing all assets
  private project?: Project;

  private activeObjects: IVrViewerPlacedObject[] = [];

  private componentDestroyed: Subject<boolean> = new Subject();
  constructor(private projectService: ProjectService) { }


  ngOnDestroy(): void {
    //unsub from all rxjs active events
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  ngOnInit(): void {
    this.getEvents();
  }

  private async getEvents() {
    this.project = await lastValueFrom(this.projectService.getProject(1));
    for (let event of this.project.events) {
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
      this.addText(spawnPosition, forward, 490, `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in lectus placerat, rhoncus lacus at, convallis ante. Sed a maximus diam. Quisque sit amet pulvinar ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer lectus eros, congue at euismod vel, dapibus eu orci. Proin non sapien est. Suspendisse ac rutrum libero. Suspendisse consectetur nibh augue, non fermentum massa imperdiet a. Nulla et felis eget augue vehicula consectetur nec nec libero. Nam eu tellus et nunc faucibus ornare. In hendrerit fringilla dolor, in blandit sem aliquet sit amet. Phasellus posuere accumsan massa eu tempus. Curabitur at metus nec mi lobortis euismod et in nulla.
      Quisque ultrices leo est, et consequat massa elementum vel. Nam luctus risus luctus, aliquet ipsum a, fermentum odio. Ut mollis tincidunt quam, eu mollis leo vulputate id. Suspendisse mi urna, bibendum sed justo id, bibendum efficitur ipsum. Pellentesque nec sapien hendrerit, pretium elit eu, eleifend magna. Sed dignissim, justo eu ultricies porttitor, dolor felis congue tellus, quis finibus velit enim non justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut ac blandit nulla, vitae ornare massa. Aliquam ultrices nibh ac erat laoreet, vel elementum urna congue. Duis non sem a sapien vulputate facilisis. Aenean pulvinar, ligula eget consectetur aliquet, nulla urna posuere dolor, fringilla scelerisque purus sem eu tortor. Suspendisse vehicula ligula ac purus vehicula, vel tempus orci rutrum.
      Donec sit amet nisi ut risus consequat tristique sit amet sit amet est. Vestibulum eget turpis justo. Vestibulum sit amet nunc egestas, porttitor enim quis, porta lacus. Donec dapibus enim ullamcorper enim interdum varius. Donec vel ullamcorper purus, ac sollicitudin arcu. Morbi augue eros, lobortis eu odio ac, ornare porta ante. Donec condimentum, arcu a laoreet imperdiet, tellus velit bibendum sem, et pharetra lectus velit a turpis. Phasellus ac porta felis, semper maximus felis. Duis lacinia arcu quis dui bibendum tempus. Praesent nulla sem, facilisis id nisl id, placerat consequat tellus. Ut efficitur augue posuere massa iaculis molestie. Morbi tempus eleifend massa, eget consectetur magna pharetra eu. Phasellus ullamcorper massa sit amet dui euismod, non consequat lorem gravida. Nulla id vestibulum leo.
      `);
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
                  let obj = (this.project!.objects as any)[id];
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
        switch (top.value.eventType) {
          case VrViewerEventType.TIME_EVENT:
            for (let action of top.value.actions) {
              switch (action.actionType) {
                case VrViewerActionType.REMOVE_TEXT:
                  let id = action.payload.id as number;
                  let obj = (this.project!.objects as any)[id];
                  if (obj && obj.start < currentTime) {
                    if (obj) {
                      let position = new Vector3(obj.position.x, obj.position.y, obj.position.z);
                      let forward = new Vector3(obj.forward.x, obj.forward.y, obj.forward.z);
                      let place_text_object = this.addText(position, forward, 490, obj.text);
                      this.activeObjects.push({ id: obj.id, action: action, object: place_text_object, start: obj.start, end: obj.end });
                    }
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
    //for debug need to improve the way I calculate the size of the box
    let spaces = textContent.length;
    let height = 1.5 + 1.5 * spaces / 800;
    let width = 1.2 + 1.2 * spaces / 800;

    /*
    const outerContainer = new Block({
      width: width,
      height: height,
      backgroundColor: new Color(0xffffff),
      backgroundOpacity: 0.1,
      fontSupersampling: true,
      justifyContent: 'center',
      textAlign: 'center',
      bestFit: "auto",
      fontFamily: './assets/Roboto-msdf.json',
      fontTexture: './assets/Roboto-msdf.png',
    });*/

    const container = new Block({
      borderWidth: 0,
      borderRadius: 0.45,
      //borderColor: new Color(0.5 + 0.5 * Math.sin(Date.now() / 500), 0.5, 1),
      width: width - 0.2,
      height: height - 0.2,
      backgroundColor: new Color(0xffffff),
      backgroundOpacity: 0.2,
      fontSupersampling: true,
      justifyContent: 'center',
      textAlign: 'center',
      fontFamily: './assets/Roboto-msdf.json',
      fontTexture: './assets/Roboto-msdf.png',
    });


    const textObject = new Text({
      content: textContent,
      fontColor: new Color(0x000000),
      fontSize: 0.1,
    });
    //outerContainer.add(container);
    container.add(textObject);
    container.position.copy(position);
    container.position.add(forward.clone().multiplyScalar(distance));
    container.lookAt(lookAt ?? this.camera.position);
    container.scale.set(100, 100, 100);
    // scene is a THREE.Scene (see three.js)
    this.scene.add(container);
    return container;
  }
}
