import { Mesh, Object3D } from "three";
import { Block } from "three-mesh-ui";

export class StaticUtils {

    public static removeObject3D(object3D: Object3D) {
        if (object3D instanceof Mesh) {
            // for better memory management and performance
            object3D.geometry.dispose();
            if (object3D.material instanceof Array) {
                // for better memory management and performance
                object3D.material.forEach(material => material.dispose());
            } else {
                // for better memory management and performance
                object3D.material.dispose();
            }
            object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
            return true;
        }

        if (object3D instanceof Block) {
            //todo
            return true;
        }
        return false;
    }
}