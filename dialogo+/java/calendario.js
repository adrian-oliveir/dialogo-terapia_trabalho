document.addEventListener('DOMContentLoaded', function() {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.querySelector('.month-year');
    const yearElement = document.querySelector('.year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const body = document.body;
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let availableDays = JSON.parse(localStorage.getItem('availableDays')) || [];
    
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
    }
    
    function renderCalendar() {
        calendarDays.innerHTML = '';
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();
        
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        monthYear.innerHTML = `${monthNames[currentMonth]} <span class="year">${currentYear}</span>`;
        
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day other-month';
            dayElement.innerHTML = `<span class="day-number">${daysInPrevMonth - firstDay + i + 1}</span>`;
            calendarDays.appendChild(dayElement);
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayElement.classList.add('current-day');
            }
            
            const dateKey = `${currentYear}-${currentMonth}-${i}`;
            if (availableDays.includes(dateKey)) {
                dayElement.classList.add('available');
                dayElement.innerHTML = `
                    <span class="day-number">${i}</span>
                    <div class="available-marker"></div>
                `;
            } else {
                dayElement.innerHTML = `<span class="day-number">${i}</span>`;
            }
            
            dayElement.addEventListener('click', () => toggleAvailability(dayElement, i));
            calendarDays.appendChild(dayElement);
        }
        
        const totalDays = firstDay + daysInMonth;
        const remainingCells = totalDays > 35 ? 42 - totalDays : 35 - totalDays;
        
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day other-month';
            dayElement.innerHTML = `<span class="day-number">${i}</span>`;
            calendarDays.appendChild(dayElement);
        }
        
        setupYearToggle();
    }
    
    function toggleAvailability(dayElement, day) {
        const dateKey = `${currentYear}-${currentMonth}-${day}`;
        const index = availableDays.indexOf(dateKey);
        
        if (index === -1) {
            availableDays.push(dateKey);
            dayElement.classList.add('available');
            dayElement.innerHTML = `
                <span class="day-number">${day}</span>
                <div class="available-marker"></div>
            `;
        } else {
            availableDays.splice(index, 1);
            dayElement.classList.remove('available');
            dayElement.innerHTML = `<span class="day-number">${day}</span>`;
        }
    }
    
    function changeMonth(step) {
        currentMonth += step;
        
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        
        renderCalendar();
    }
    
    function setupYearToggle() {
        const yearElement = document.querySelector('.year');
        if (yearElement) {
            yearElement.addEventListener('click', function(e) {
                e.preventDefault();
                body.classList.toggle('dark-theme');
                localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
            });
        }
    }
    
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    
    saveBtn.addEventListener('click', () => {
        localStorage.setItem('availableDays', JSON.stringify(availableDays));
        alert('Disponibilidade salva com sucesso!');
    });
    
    clearBtn.addEventListener('click', () => {
        if (confirm('Limpar todos os dias disponíveis?')) {
            availableDays = [];
            localStorage.removeItem('availableDays');
            renderCalendar();
        }
    });
    
    renderCalendar();
});