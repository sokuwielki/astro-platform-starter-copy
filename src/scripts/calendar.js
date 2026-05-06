export function initCalendar() {
    let currentMonth = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    async function renderCalendar() {
        let bookedDates = [];
        try {
            const res = await fetch('/availability.json');
            if (res.ok) {
                const data = await res.json();
                bookedDates = data.bookedDates || [];
            }
        } catch (e) { console.log("No availability file found"); }

        const daysContainer = document.getElementById('calendar-days');
        const monthLabel = document.getElementById('month-label');
        const prevBtn = document.getElementById('prev-month');
        
        if (!daysContainer || !monthLabel) return;

        daysContainer.innerHTML = '';
        monthLabel.innerText = currentMonth.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        let firstDay = new Date(year, month, 1).getDay();
        firstDay = (firstDay === 0) ? 6 : firstDay - 1; 
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            daysContainer.appendChild(document.createElement('div'));
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const dateStr = dateObj.toISOString().split('T')[0];
            const isPast = dateObj < today;
            const isBooked = bookedDates.includes(dateStr);

            const dayEl = document.createElement('div');
            dayEl.className = "py-3 rounded-md text-sm font-medium border";
            dayEl.textContent = d;

            if (isPast) {
                dayEl.classList.add("bg-gray-100", "text-gray-400");
            } else if (isBooked) {
                dayEl.classList.add("bg-red-100", "text-red-700", "border-red-200", "line-through");
            } else {
                dayEl.classList.add("bg-green-50", "text-green-700", "border-green-200");
            }
            daysContainer.appendChild(dayEl);
        }

        if (prevBtn) {
            prevBtn.style.visibility = (month === today.getMonth() && year === today.getFullYear()) ? 'hidden' : 'visible';
        }
    }

    // Set up listeners
    document.getElementById('open-calendar')?.addEventListener('click', () => {
        document.getElementById('calendar-modal')?.classList.remove('hidden');
        renderCalendar();
    });

    document.getElementById('next-month')?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById('prev-month')?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
    });
}