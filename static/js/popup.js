// Function to open the popup
function openPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// Event listener for opening the popup
const openPopupButton = document.getElementById('openPopupButton');
openPopupButton.addEventListener('click', openPopup);

// Event listener for closing the popup
const closePopupIcon = document.getElementById('closePopupIcon');
closePopupIcon.addEventListener('click', closePopup);

// Event listener for opening the Mission Planner popup
const openMissionPlannerPopupButton = document.getElementById('openMissionPlannerPopupButton');
openMissionPlannerPopupButton.addEventListener('click', openPopup);

// Event listener for closing the Mission Planner popup
const closeMissionPlannerPopupButton = document.getElementById('closePopupIcon');
closeMissionPlannerPopupButton.addEventListener('click', closePopup);
