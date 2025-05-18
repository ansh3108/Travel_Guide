document.addEventListener("DOMContentLoaded", function() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function() {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("dark-mode", "enabled");
            } else {
                localStorage.setItem("dark-mode", "disabled");
            }
        });
    }

    const backToTopButton = document.getElementById("backToTopBtn");
    window.onscroll = function() {
        if (document.body.scrollTop > 172 || document.documentElement.scrollTop > 172) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };
    window.scrollToTop = function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    async function fetchWeather(city) {
        const apiKey = 'YOUR_API_KEY';
        const url = `https://openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data && data.main) {
                document.getElementById('weatherLocation').textContent = data.name + ', ' + data.sys.country;
                document.getElementById('weatherTemp').textContent = Math.round(data.main.temp) + '°C';
                document.getElementById('weatherDesc').textContent = data.weather[0].main;
            } else {
                document.getElementById('weatherLocation').textContent = 'Not found';
                document.getElementById('weatherTemp').textContent = '';
                document.getElementById('weatherDesc').textContent = '';
            }
        } catch {
            document.getElementById('weatherLocation').textContent = 'Error';
            document.getElementById('weatherTemp').textContent = '';
            document.getElementById('weatherDesc').textContent = '';
        }
    }

    function getWeatherByLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                fetch(`https://openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.main) {
                            document.getElementById('weatherLocation').textContent = data.name + ', ' + data.sys.country;
                            document.getElementById('weatherTemp').textContent = Math.round(data.main.temp) + '°C';
                            document.getElementById('weatherDesc').textContent = data.weather[0].main;
                        } else {
                            document.getElementById('weatherLocation').textContent = 'Not found';
                            document.getElementById('weatherTemp').textContent = '';
                            document.getElementById('weatherDesc').textContent = '';
                        }
                    })
                    .catch(() => {
                        document.getElementById('weatherLocation').textContent = 'Error';
                        document.getElementById('weatherTemp').textContent = '';
                        document.getElementById('weatherDesc').textContent = '';
                    });
            }, () => {
                fetchWeather('London');
            });
        } else {
            fetchWeather('London');
        }
    }
    getWeatherByLocation();

    const currencyList = ["USD","EUR","INR","GBP","JPY","CAD","AUD","CNY","SGD","ZAR"];
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    if (fromCurrency && toCurrency) {
        currencyList.forEach(cur => {
            let opt1 = document.createElement('option');
            opt1.value = cur; opt1.text = cur;
            fromCurrency.appendChild(opt1);
            let opt2 = document.createElement('option');
            opt2.value = cur; opt2.text = cur;
            toCurrency.appendChild(opt2);
        });
        fromCurrency.value = "USD";
        toCurrency.value = "INR";
    }

    document.getElementById('convertBtn').onclick = function() {
        const amount = parseFloat(document.getElementById('amount').value);
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const rates = {
            USD: 1,
            EUR: 0.92,
            INR: 83.5,
            GBP: 0.79,
            JPY: 155.7,
            CAD: 1.36,
            AUD: 1.51,
            CNY: 7.22,
            SGD: 1.35,
            ZAR: 18.2
        };
        if (from === to) {
            document.getElementById('conversionResult').textContent = amount + ' ' + from + ' = ' + amount + ' ' + to;
            return;
        }
        if (rates[from] && rates[to]) {
            const usdAmount = amount / rates[from];
            const converted = usdAmount * rates[to];
            document.getElementById('conversionResult').textContent = amount + ' ' + from + ' = ' + converted.toFixed(2) + ' ' + to;
        } else {
            document.getElementById('conversionResult').textContent = 'Conversion error';
        }
    }

    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    const destinations = [
        { name: 'Santorini', coords: [36.3932, 25.4615] },
        { name: 'Alps', coords: [46.8876, 9.6570] },
        { name: 'Tokyo', coords: [35.6895, 139.6917] },
        { name: 'Cape Town', coords: [-33.9249, 18.4241] },
        { name: 'Sydney', coords: [-33.8688, 151.2093] }
    ];
    destinations.forEach(dest => {
        L.marker(dest.coords).addTo(map).bindPopup(dest.name);
    });

    const starterItems = [
        'Passport',
        'Tickets',
        'Phone Charger',
        'Toothbrush',
        'Clothes',
    ];
    const checklist = document.getElementById('checklist');
    const newItemInput = document.getElementById('newItemInput');
    const addItemBtn = document.getElementById('addItemBtn');

    function renderChecklist() {
        checklist.innerHTML = '';
        items.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = 'checklist-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.checked;
            checkbox.onchange = function() {
                item.checked = this.checked;
            };
            const span = document.createElement('span');
            span.textContent = item.text;
            if (item.checked) span.style.textDecoration = 'line-through';
            checkbox.addEventListener('change', function() {
                span.style.textDecoration = this.checked ? 'line-through' : '';
            });
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '✕';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = function() {
                items.splice(idx, 1);
                renderChecklist();
            };
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(removeBtn);
            checklist.appendChild(li);
        });
    }
    let items = starterItems.map(text => ({ text, checked: false }));
    renderChecklist();
    addItemBtn.onclick = function() {
        const val = newItemInput.value.trim();
        if (val) {
            items.push({ text: val, checked: false });
            newItemInput.value = '';
            renderChecklist();
        }
    };
    newItemInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addItemBtn.click();
    });

    const budgetTotal = document.getElementById('budgetTotal');
    const setBudgetBtn = document.getElementById('setBudgetBtn');
    const expenseName = document.getElementById('expenseName');
    const expenseAmount = document.getElementById('expenseAmount');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const displayBudget = document.getElementById('displayBudget');
    const displaySpent = document.getElementById('displaySpent');
    const displayRemaining = document.getElementById('displayRemaining');
    const expenseList = document.getElementById('expenseList');
    let budget = 0;
    let expenses = [];
    function updateBudgetUI() {
        displayBudget.textContent = budget;
        const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
        displaySpent.textContent = spent;
        displayRemaining.textContent = budget - spent;
    }
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((e, i) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${e.name}</span><span>${e.amount}</span><button class="remove-expense">✕</button>`;
            li.querySelector('.remove-expense').onclick = function() {
                expenses.splice(i, 1);
                renderExpenses();
                updateBudgetUI();
            };
            expenseList.appendChild(li);
        });
    }
    setBudgetBtn.onclick = function() {
        const val = parseFloat(budgetTotal.value);
        if (!isNaN(val) && val >= 0) {
            budget = val;
            updateBudgetUI();
        }
    };
    addExpenseBtn.onclick = function() {
        const name = expenseName.value.trim();
        const amt = parseFloat(expenseAmount.value);
        if (name && !isNaN(amt) && amt > 0) {
            expenses.push({ name, amount: amt });
            expenseName.value = '';
            expenseAmount.value = '';
            renderExpenses();
            updateBudgetUI();
        }
    };
    updateBudgetUI();
    renderExpenses();

    const tripDateInput = document.getElementById('tripDate');
    const setTripDateBtn = document.getElementById('setTripDateBtn');
    const countdownDisplay = document.getElementById('countdownDisplay');
    let countdownInterval;
    function updateCountdown(dateStr) {
        if (countdownInterval) clearInterval(countdownInterval);
        function renderCountdown() {
            const now = new Date();
            const tripDate = new Date(dateStr);
            const diff = tripDate - now;
            if (isNaN(tripDate.getTime())) {
                countdownDisplay.textContent = '';
                return;
            }
            if (diff <= 0) {
                countdownDisplay.textContent = "It's time for your trip!";
                clearInterval(countdownInterval);
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            countdownDisplay.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds left!`;
        }
        renderCountdown();
        countdownInterval = setInterval(renderCountdown, 1000);
    }
    setTripDateBtn.onclick = function() {
        const dateStr = tripDateInput.value;
        if (dateStr) {
            updateCountdown(dateStr);
        }
    };

    const travelQuotes = [
      "The world is a book and those who do not travel read only one page. – Saint Augustine",
      "Traveling – it leaves you speechless, then turns you into a storyteller. – Ibn Battuta",
      "Not all those who wander are lost. – J.R.R. Tolkien",
      "To travel is to live. – Hans Christian Andersen",
      "Jobs fill your pocket, but adventures fill your soul. – Jaime Lyn Beatty",
      "Travel makes one modest. You see what a tiny place you occupy in the world. – Gustave Flaubert",
      "Life is short and the world is wide. – Simon Raven",
      "Wherever you go becomes a part of you somehow. – Anita Desai",
      "Take only memories, leave only footprints. – Chief Seattle",
      "Adventure may hurt you but monotony will kill you. – Unknown"
    ];
    const travelQuoteText = document.getElementById('travelQuoteText');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    function showRandomQuote() {
      const idx = Math.floor(Math.random() * travelQuotes.length);
      travelQuoteText.textContent = travelQuotes[idx];
    }
    if (newQuoteBtn) {
      newQuoteBtn.onclick = showRandomQuote;
    }
});
