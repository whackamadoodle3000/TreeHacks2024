import '../App.css';
import * as THREE from 'three';
import { useEffect, useRef, useState } from "react";

export default function Spine(props) {
    const refContainer = useRef(null);

    useEffect(() => {
        var scene, camera, renderer, spine;
        let angle = 0; // Initialize angle for circular motion
        let i = 0;

        // console.log(props)

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x8FBCD4);

        const w = 200;
        const h = 400;

        camera = new THREE.PerspectiveCamera(100, w / h , 0.1, 1000);
        camera.position.set(0, 27, 40);
            camera.lookAt(new THREE.Vector3(0, 15, 0));

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(w, h, true);
        // document.body.appendChild(renderer.domElement);
        console.log(refContainer.current)
        refContainer.current && refContainer.current.appendChild( renderer.domElement );

        spine = new THREE.Group();
      
        function addVertebra(diameter, height, yOffset, color, spineGroup, index) {
            const geometry = new THREE.CylinderGeometry(diameter, diameter, height, 32);
            const material = new THREE.MeshBasicMaterial({color: color});
            const vertebra = new THREE.Mesh(geometry, material);
            vertebra.position.y = yOffset;
            spineGroup.add(vertebra);
        }


        function animate() {
            console.log("this" + props.spinePoint.current)

            camera.position.set(0, 30, 25); // Move the camera back or adjust as needed
            camera.fov = 80; // Increase the field of view if necessary
            camera.updateProjectionMatrix();

            requestAnimationFrame(animate);
            angle += 0.05; // Increment the angle to make the spine move in a circle

            let radius = 2; // Radius of the circle for the circular motion
            spine.position.x = Math.sin(angle) * radius; // Circular motion on the X-axis
            spine.position.z = Math.cos(angle) * radius; // Circular motion on the Z-axis

            // console.log(spine.getObjectByName('vertebra-0'))

            function createSpine(spineGroup) {
              // Cervical vertebrae: smaller and closer together
              
              if (props.spinePoint.current === -1) {
              for (let i = 0; i < 7; i++) {
                  addVertebra(0.75, 0.5, i * 1.5, 0x888888, spineGroup); // Highlighted in red
              }} 
              else if (props.spinePoint.current === 1) {
                 for (let i = 0; i < 7; i++) {
                addVertebra(0.75, 0.5, i * 1.5, 0xff0000, spineGroup);
              }
            }
            
  
              // Thoracic vertebrae: slightly larger, incrementally increasing in size
              if (props.spinePoint.current === -1) {
              for (let i = 7; i < 19; i++) {
                  let scale = 1 + (i - 7) * 0.05;
                  addVertebra(scale * 0.9, scale * 0.75, i * 1.5, 0x888888, spineGroup);
              }} else if (props.spinePoint.current === 1) {
                for (let i = 7; i < 19; i++) {
                    let scale = 1 + (i - 7) * 0.05;
                    addVertebra(scale * 0.9, scale * 0.75, i * 1.5, 0xff000, spineGroup);
                }}
  
              // Lumbar vertebrae: largest
              if (props.spinePoint.current === -1) {
              for (let i = 19; i < 24; i++) {
                  addVertebra(1.5, 1.25, i * 1.5, 0x888888, spineGroup);
              }} else if (props.spinePoint.current === 2) {
                for (let i = 7; i < 19; i++) {
                    let scale = 1 + (i - 7) * 0.05;
                    addVertebra(scale * 0.9, scale * 0.75, i * 1.5, 0xff000, spineGroup);
                }}
  
              // Sacrum and Coccyx: represented as a single block
              if (props.spinePoint.current === -1) {
              let sacrumGeometry = new THREE.CylinderGeometry(1.75, 1.75, 2, 32);
              let sacrumMaterial = new THREE.MeshBasicMaterial({color: 0x888888});
              let sacrum = new THREE.Mesh(sacrumGeometry, sacrumMaterial);
              sacrum.position.y = 24 * 1.5; // Adjusted for the position in the group
              spineGroup.add(sacrum); }
              else if (props.spinePoint.current === 2) {
                for (let i = 7; i < 19; i++) {
                    let scale = 1 + (i - 7) * 0.05;
                    addVertebra(scale * 0.9, scale * 0.75, i * 1.5, 0x88ff00, spineGroup);
                }}
          }


        createSpine(spine);
        scene.add(spine);   

            renderer.render(scene, camera);
        }
        animate();

    }, []);
    return (
        <div className='spine' ref={refContainer}></div>
    );
}