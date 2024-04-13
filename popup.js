document.addEventListener('DOMContentLoaded', function() {
    function updateTimeDisplay() {
        chrome.runtime.sendMessage({cmd: "getTimeData"}, function(response) {
            const container = document.getElementById('timeDisplay');
            container.innerHTML = '';
            if (response && response.data) {
                Object.keys(response.data).forEach(domain => {
                    let time = response.data[domain].totalTime;
                    let minutes = Math.floor(time / 60000);
                    let seconds = Math.floor((time % 60000) / 1000);
                    let secondsPadded = seconds.toString().padStart(2, '0');

                    const div = document.createElement('div');
                    const favicon = document.createElement('img');
                    const text = document.createElement('span');

                    favicon.src = `https://www.google.com/s2/favicons?domain=${domain}`;
                    favicon.style.height = '16px';
                    favicon.style.width = '16px';
                    favicon.style.marginRight = '8px';

                    text.textContent = `${domain}: ${minutes}:${secondsPadded}`;

                    div.appendChild(favicon);
                    div.appendChild(text);
                    container.appendChild(div);
                });
            } else {
                container.textContent = 'No data available.';
            }
        });
    }

    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);
});
