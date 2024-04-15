document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('timeDisplay');

    function updateTimeDisplay() {
        chrome.runtime.sendMessage({ cmd: "getTimeData" }, function(response) {
            console.log('Response received', response); 
            container.innerHTML = '';
            if (response && response.data) {
                Object.entries(response.data).forEach(([domain, { totalTime }]) => {
                    const div = document.createElement('div');
                    const favicon = document.createElement('img');
                    const text = document.createElement('span');
                    
                    const totalSeconds = Math.floor(totalTime / 1000);
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    let trimmedDomain = domain.replace(/^www\./, '').split('.')[0];

                    favicon.src = `https://www.google.com/s2/favicons?domain=${domain}`;
                    favicon.style.height = '16px';
                    favicon.style.width = '16px';
                    favicon.style.marginRight = '8px';

                    text.textContent = `${trimmedDomain}: ${minutes}:${seconds.toString().padStart(2, '0')}`;

                    div.appendChild(favicon);
                    div.appendChild(text);
                    container.appendChild(div);
                });
            } else {
                container.textContent = 'No data available.';
            }
        });
    }

    // Update display every second
    setInterval(updateTimeDisplay, 1000);
});
