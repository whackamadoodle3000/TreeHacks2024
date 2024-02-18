
    setTimeout(() => {
            document.querySelector('.spinner').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            initSpineScene(); // Initialize the spine scene after showing the main content
        }, 3000); // Adjust the timeout as needed

           function initSpineScene() {
        let scene, camera, renderer, spine;
        let angle = 0; // Initialize angle for circular motion

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x8FBCD4);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 30, 100);
        camera.lookAt(new THREE.Vector3(0, 15, 0));

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        spine = new THREE.Group();

        createSpine(spine);
        scene.add(spine);

        function createSpine(spineGroup) {
            // Cervical vertebrae: smaller and closer together
            for (let i = 0; i < 7; i++) {
                addVertebra(0.75, 0.5, i * 1.5, 0xff0000, spineGroup); // Highlighted in red
            }

            // Thoracic vertebrae: slightly larger, incrementally increasing in size
            for (let i = 7; i < 19; i++) {
                let scale = 1 + (i - 7) * 0.05;
                addVertebra(scale * 0.9, scale * 0.75, i * 1.5, 0x888888, spineGroup);
            }

            // Lumbar vertebrae: largest
            for (let i = 19; i < 24; i++) {
                addVertebra(1.5, 1.25, i * 1.5, 0x888888, spineGroup);
            }

            // Sacrum and Coccyx: represented as a single block
            let sacrumGeometry = new THREE.CylinderGeometry(1.75, 1.75, 2, 32);
            let sacrumMaterial = new THREE.MeshBasicMaterial({color: 0x888888});
            let sacrum = new THREE.Mesh(sacrumGeometry, sacrumMaterial);
            sacrum.position.y = 24 * 1.5; // Adjusted for the position in the group
            spineGroup.add(sacrum);
        }

        function addVertebra(diameter, height, positionY, color, spineGroup) {
            let geometry = new THREE.CylinderGeometry(diameter, diameter, height, 32);
            let material = new THREE.MeshBasicMaterial({color: color});
            let vertebra = new THREE.Mesh(geometry, material);
            vertebra.position.y = positionY;
            spineGroup.add(vertebra);
        }

        function animate() {
            camera.position.set(0, 30, 50); // Move the camera back or adjust as needed
            camera.fov = 80; // Increase the field of view if necessary
            camera.updateProjectionMatrix();

            requestAnimationFrame(animate);
            angle += 0.05; // Increment the angle to make the spine move in a circle

            let radius = 2; // Radius of the circle for the circular motion
            spine.position.x = Math.sin(angle) * radius; // Circular motion on the X-axis
            spine.position.z = Math.cos(angle) * radius; // Circular motion on the Z-axis

            renderer.render(scene, camera);
        }

        animate();
    }