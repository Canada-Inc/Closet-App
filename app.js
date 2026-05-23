// ==========================================
// 1. DATABASE CONFIGURATION (Firebase Core)
// ==========================================
// To get your own live tokens, create a free database console setup at console.firebase.google.com
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase App Instantiations
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global runtime variables tracking data states
let currentUser = null;
let currentClosetInventory = { hat: [], torso: [], legs: [], feet: [] };
let activePointers = { hat: 0, torso: 0, legs: 0, feet: 0 };

// 3D Runtime Objects Engine Global Parameters
let scene, camera, renderer, mannequinUserBody;
let loadedEquippedGarments = { hat: null, torso: null, legs: null, feet: null };

// Monitor User Account Logins Session loops
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('authOverlay').style.display = 'none';
        document.getElementById('userGreeting').innerText = `Styling Space: ${user.email}`;
        
        // Initialize Core Engines
        init3DViewportWorld();
        loadUserSpecificClosetData();
    } else {
        currentUser = null;
        document.getElementById('authOverlay').style.display = 'flex';
    }
});

// User sign up and login logic handlers
function handleAuth(type) {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    
    if(!email || !password) return alert("Fill out credentials input boxes.");

    if(type === 'register') {
        auth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                // Instantly generate separate private workspace files on database cloud servers
                return db.collection('user_closets').doc(cred.user.uid).set({
                    hat: ["https://modelviewer.dev/shared-assets/models/Astronaut.glb"], // Starter sample 3D component meshes
                    torso: [], legs: [], feet: []
                });
            }).catch(err => alert(err.message));
    } else {
        auth.signInWithEmailAndPassword(email, password).catch(err => alert(err.message));
    }
}

function logout() { auth.signOut(); window.location.reload(); }

// ==========================================
// 2. 3D GRAPHICS RENDER ENGINE (Three.js Setup)
// ==========================================
function init3DViewportWorld() {
    const frameContainer = document.getElementById('canvas3dContainer');
    if (scene) return; // Prevent double canvas rendering resets

    // Establish 3D Coordinate Space environment rules
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121214);

    camera = new THREE.PerspectiveCamera(45, frameContainer.clientWidth / frameContainer.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 3); // Position lens viewing angles squarely inside dressing area

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(frameContainer.clientWidth, frameContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    frameContainer.appendChild(renderer.domElement);

    // Illuminate dressing stage space setup
    const overheadSkyLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(overheadSkyLight);

    const studioSpotDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    studioSpotDirectionalLight.position.set(5, 10, 7);
    scene.add(studioSpotDirectionalLight);

    // Generate basic mannequin geometry matrix to represent the user body
    const mannequinMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 0.5 });
    mannequinUserBody = new THREE.Group();

    const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.6), mannequinMaterial);
    torsoMesh.position.y = 1.0;
    
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12), mannequinMaterial);
    headMesh.position.y = 1.45;

    mannequinUserBody.add(torsoMesh);
    mannequinUserBody.add(headMesh);
    scene.add(mannequinUserBody);

    // Begin render frame processing loop
    function animate() {
        requestAnimationFrame(animate);
        mannequinUserBody.rotation.y += 0.005; // Gentle rotational movement tracking views
        renderer.render(scene, camera);
    }
    animate();
}

// Customizer sliders interface scaling engine adjustments
function adjustAvatarDimension() {
    const hScale = document.getElementById('avatarHeight').value;
    const wScale = document.getElementById('avatarWidth').value;
    
    if (mannequinUserBody) {
        mannequinUserBody.scale.set(wScale, hScale, wScale);
    }
}

// ==========================================
// 3. AI AI 3D GENERATION INTEGRATION PIPELINE
// ==========================================
function triggerAI3DGeneration() {
    const imgFile = document.getElementById('imageInput').files[0];
    const category = document.getElementById('itemCategory').value;
    const btn = document.getElementById('genBtn');

    if(!imgFile) return alert("Snap a photo frame element first!");

    btn.innerText = "Processing AI Mesh Assets... (Approx 30s)";
    btn.disabled = true;

    // In a production server environment setup, you route this blob straight to an AI API backend mesh constructor engine like Tripo3D or Meshy.
    // For this direct phone client build, we simulate the output generation callback hook directly:
    setTimeout(() => {
        // Mocking a freshly synthesized GLTF 3D garment asset file model returned from neural layers
        const syntheticMockGLTFUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
        
        // Push newly calculated mesh profile reference links directly into the private Cloud Firestore database node
        db.collection('user_closets').doc(currentUser.uid).update({
            [category]: firebase.firestore.FieldValue.arrayUnion(syntheticMockGLTFUrl)
        }).then(() => {
            alert("Neural reconstruction complete! Model rendered down to personal cloud wardrobe space.");
            btn.innerText = "Generate 3D Garment";
            btn.disabled = false;
            loadUserSpecificClosetData();
        });
    }, 4000);
}

// Pull private cloud inventory array nodes down into system arrays matching the current user context
function loadUserSpecificClosetData() {
    db.collection('user_closets').doc(currentUser.uid).get().then(doc => {
        if(doc.exists()) {
            currentClosetInventory = doc.data();
            equipMeshItemToStage('hat');
        }
    });
}

function cycle3DAsset(category) {
    const pool = currentClosetInventory[category] || [];
    if(pool.length === 0) return alert("This sector storage category contains no mesh data profiles yet.");
    
    activePointers[category] = (activePointers[category] + 1) % pool.length;
    equipMeshItemToStage(category);
}

// Erases old clothing layers and maps the active 3D gltf file over the body geometry nodes
function equipMeshItemToStage(category) {
    const assetUrl = currentClosetInventory[category]?.[activePointers[category]];
    if(!assetUrl) return;

    // Wipe matching structural elements currently tracking on stage
    if(loadedEquippedGarments[category]) {
        mannequinUserBody.remove(loadedEquippedGarments[category]);
    }

    const loader = new THREE.GLTFLoader();
    loader.load(assetUrl, (gltf) => {
        const clothingMeshModel = gltf.scene;
        
        // Scale and align models to match approximate bone layout structures based on category anchors
        clothingMeshModel.scale.set(0.4, 0.4, 0.4);
        if(category === 'hat') clothingMeshModel.position.set(0, 1.5, 0);
        if(category === 'torso') clothingMeshModel.position.set(0, 1.0, 0);

        loadedEquippedGarments[category] = clothingMeshModel;
        mannequinUserBody.add(clothingMeshModel);
    });
}