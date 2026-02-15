document.addEventListener('DOMContentLoaded', () => {
    const talksContainer = document.getElementById('talks-container');
    const searchInput = document.getElementById('category-search');
    const searchButton = document.getElementById('search-button');

    const eventStartTime = new Date();
    eventStartTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    const renderSchedule = (filteredTalks) => {
        talksContainer.innerHTML = '';
        let currentTime = new Date(eventStartTime);

        filteredTalks.forEach((talk, index) => {
            // Add talk to schedule
            const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);
            const talkElement = document.createElement('div');
            talkElement.classList.add('talk-card');
            talkElement.innerHTML = `
                <p class="time">${formatTime(currentTime)} - ${formatTime(talkEndTime)}</p>
                <h3>${talk.title}</h3>
                <p class="speakers"><strong>Speakers:</strong> ${talk.speakers.join(' & ')}</p>
                <p class="category"><strong>Categories:</strong> ${talk.category.join(', ')}</p>
                <p>${talk.description}</p>
            `;
            talksContainer.appendChild(talkElement);
            currentTime = talkEndTime;

            // Add transition break if not the last talk
            if (index < filteredTalks.length - 1) {
                if (index === 2) { // Special case for lunch after the 3rd talk (index 2)
                    const lunchEndTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hour lunch
                    const lunchElement = document.createElement('div');
                    lunchElement.classList.add('break-card');
                    lunchElement.textContent = `Lunch Break: ${formatTime(currentTime)} - ${formatTime(lunchEndTime)}`;
                    talksContainer.appendChild(lunchElement);
                    currentTime = lunchEndTime;
                } else {
                    const transitionEndTime = new Date(currentTime.getTime() + 10 * 60 * 1000); // 10 minutes transition
                    const transitionElement = document.createElement('div');
                    transitionElement.classList.add('break-card');
                    transitionElement.textContent = `Transition Break: ${formatTime(currentTime)} - ${formatTime(transitionEndTime)}`;
                    talksContainer.appendChild(transitionElement);
                    currentTime = transitionEndTime;
                }
            }
        });
    };

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talks.filter(talk =>
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    // Initial render
    renderSchedule(talks);
});
