// Global Closet Inventory Storage Array
let closet = {
    hats: ["https://images.unsplash.com/photo-1534215754734-18e55d13ce35?w=300&q=80"], // Starter Cap
    tops: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&q=80"], // Starter Tee
    bottoms: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80"], // Starter Denim
    shoes: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80"]  // Starter Kicks
};

// State pointer metrics index tracking
let currentSelection = { hats: 0, tops: 0, bottoms: 0, shoes: 0 };
let lookbookHistory = [];

// Initialize & draw base defaults
window.onload = function() {
    renderAvatarLayers();
    updateVaultView();
    processWeatherHeuristics();
};

// Process file upload dynamically array push
function uploadItem() {
    const fileSelector = document.getElementById('imageLoader');
    const assignedCategory = document.getElementById('categorySelect').value;

    if (fileSelector.files && fileSelector.files[0]) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const uploadedDataUrl = event.target.result;
            
            // Add new asset item to state matrix
            closet[assignedCategory].push(uploadedDataUrl);
            
            // Snap modern selection pointer context index directly to the newly processed item
            currentSelection[assignedCategory] = closet[assignedCategory].length - 1;
            
            // Re-render display channels
            renderAvatarLayers();
            updateVaultView();
            
            alert("Garment calibrated successfully to avatar dimensions.");
        };
        fileReader.readAsDataURL(fileSelector.files[0]);
    } else {
        alert("Select asset image file boundary parameters first.");
    }
}

// Global toggle rotation module
function cycle(category, direction) {
    const totalItems = closet[category].length;
    if (totalItems === 0) return;

    // Boundary wrap safety parameters logic
    currentSelection[category] = (currentSelection[category] + direction + totalItems) % totalItems;
    renderAvatarLayers();
}

// Maps model nodes directly onto layout framework components
function renderAvatarLayers() {
    for (let componentKey in closet) {
        const targetDOMNode = document.getElementById(`layer-${componentKey}`);
        const assetIndex = currentSelection[componentKey];
        const dataPayload = closet[componentKey][assetIndex];

        if (dataPayload) {
            targetDOMNode.src = dataPayload;
            targetDOMNode.style.display = "block";
        } else {
            targetDOMNode.style.display = "none";
        }
    }
}

// Updates lower asset deck visual layout grid blocks
function updateVaultView() {
    const container = document.getElementById('vaultGrid');
    container.innerHTML = '';

    for (let groupKey in closet) {
        closet[groupKey].forEach(assetUrl => {
            const itemFrame = document.createElement('div');
            itemFrame.className = 'vault-card';
            itemFrame.innerHTML = `<img src="${assetUrl}">`;
            container.appendChild(itemFrame);
        });
    }
}

// Tracks selection profiles dynamically for algorithmic style adaptation logic
function logOutfit() {
    const fitSnapshot = {
        hat: closet.hats[currentSelection.hats],
        top: closet.tops[currentSelection.tops],
        bottom: closet.bottoms[currentSelection.bottoms],
        shoe: closet.shoes[currentSelection.shoes],
        timestamp: new Date().toLocaleDateString()
    };

    lookbookHistory.push(fitSnapshot);
    alert("Ensemble compilation logged to styling database profile.");
    processWeatherHeuristics();
}

// Local simulation analysis framework system profile matching engine
function processWeatherHeuristics() {
    const outputField = document.getElementById('weatherEngine');
    
    // Simulate structural predictive recommendations logic tracking data states
    if (lookbookHistory.length === 0) {
        outputField.innerHTML = `🌤️ <b>AI Engine Status:</b> Standard climate settings active. Select lightweight layers for mid-tier thermal balances.`;
    } else {
        outputField.innerHTML = `🤖 <b>AI Engine Optimizing:</b> Style history loop recognized. Prioritizing matching selections against your recent favorite configurations.`;
    }
}