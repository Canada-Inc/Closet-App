// ====== SECURITY PASSTHROW ======
(function() {
    const SECRET_PASSWORD = "OurSecretCloset"; // Change this to your password!
    let authenticated = false;
    while (!authenticated) {
        let entry = prompt("Enter password to access closet:");
        if (entry === SECRET_PASSWORD) { authenticated = true; } 
        else { alert("Wrong password!"); }
    }
})();

let closet = {
    tops: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=300"],
    bottoms: ["https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=300"],
    shoes: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300"]
};
let currentIndexes = { tops: 0, bottoms: 0, shoes: 0 };
let styleHistory = [];

function uploadItem() {
    const fileInput = document.getElementById('imageLoader');
    const category = document.getElementById('categorySelect').value;
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            closet[category].push(e.target.result);
            updateInventoryGrid();
            alert("Added to closet!");
        }
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function next(category) {
    if (closet[category].length === 0) return;
    currentIndexes[category] = (currentIndexes[category] + 1) % closet[category].length;
    updateDisplay();
}

function prev(category) {
    if (closet[category].length === 0) return;
    currentIndexes[category] = (currentIndexes[category] - 1 + closet[category].length) % closet[category].length;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('currentTop').src = closet.tops[currentIndexes.tops];
    document.getElementById('currentBottom').src = closet.bottoms[currentIndexes.bottoms];
    document.getElementById('currentShoes').src = closet.shoes[currentIndexes.shoes];
}

function logOutfit() {
    styleHistory.push({ top: closet.tops[currentIndexes.tops], bottom: closet.bottoms[currentIndexes.bottoms] });
    alert("Outfit Saved!");
    generateRecommendation();
}

function generateRecommendation() {
    const weather = document.getElementById('weatherInput').value;
    const aiBox = document.getElementById('aiSuggestion');
    if (weather === 'sunny') aiBox.innerHTML = `☀️ AI Match: Warm day combo! Try your favorite lightweight skirt look.`;
    else aiBox.innerHTML = `🌧️ AI Match: Layer up with pants and your thickest jacket today.`;
    if (styleHistory.length > 0) aiBox.innerHTML += `<br>⭐ Using your style history pattern!`;
}

function updateInventoryGrid() {
    const grid = document.getElementById('inventoryGrid');
    grid.innerHTML = '';
    for (let cat in closet) {
        closet[cat].forEach(url => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerHTML = `<img src="${url}">`;
            grid.appendChild(div);
        });
    }
}
updateInventoryGrid();