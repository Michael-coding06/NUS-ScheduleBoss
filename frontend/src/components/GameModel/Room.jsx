import { useGLTF } from "@react-three/drei";
import { forwardRef, useImperativeHandle } from "react";
import * as THREE from 'three';

const RoomModel = forwardRef(({ url = './room.glb' }, ref) => {
  const { scene } = useGLTF(url);

  const duplicateBook = () => {
    const colorGen = () => new THREE.Color(Math.random(), Math.random(), Math.random());

    let maxIdx = -1;
    scene.traverse((obj) => {
      const match = obj.name.match(/^book(?:\s(\d+))?$/);
      if (match) {
        const idx = match[1] ? parseInt(match[1]) : 0;
        if (idx > maxIdx) maxIdx = idx;
      }
    });

    const book = scene.getObjectByName(`book ${maxIdx}`);
    const book_page = scene.getObjectByName(`book_page ${maxIdx}`);

    if (!book || !book_page) {
      console.warn("No base book or book page found to duplicate.");
      return;
    }

    const new_book = book.clone();
    const new_page = book_page.clone();
    new_book.name = `book ${maxIdx + 1}`;
    new_page.name = `book_page ${maxIdx + 1}`;
    new_book.position.x -= 0.1;
    new_page.position.x -= 0.1;

    const mat = new THREE.MeshStandardMaterial({ color: colorGen() });
    new_book.traverse(child => {
      if (child.isMesh) child.material = mat;
    });

    scene.add(new_book);
    scene.add(new_page);
  };

  useImperativeHandle(ref, () => ({
    duplicateBook
  }));

  return <primitive object={scene} />;
});

export default RoomModel;
