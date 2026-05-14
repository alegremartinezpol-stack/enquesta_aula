document.addEventListener('DOMContentLoaded', () => {
    // Initial data matching the screenshot for DAW1A
    let surveys = [
        { group: 'DAW1A', rating: 2, comment: '' },
        { group: 'DAW1A', rating: 2, comment: '' },
        { group: 'DAW1A', rating: 3, comment: 'Em va costar la part de gràfics.' },
        { group: 'DAW1A', rating: 3, comment: '' },
        { group: 'DAW1A', rating: 3, comment: '' },
        { group: 'DAW1A', rating: 4, comment: 'La part de conclusions és interessant.' },
        { group: 'DAW1A', rating: 4, comment: '' },
        { group: 'DAW1A', rating: 4, comment: '' },
        { group: 'DAW1A', rating: 4, comment: '' },
        { group: 'DAW1A', rating: 5, comment: 'Molt bona sessió' },
        { group: 'DAW1A', rating: 5, comment: '' },
        { group: 'DAW1A', rating: 5, comment: '' },
        
        { group: 'DAW1B', rating: 4, comment: 'Bé.' },
        { group: 'DAW1B', rating: 3, comment: 'Normal.' },
        { group: 'ASIX1', rating: 5, comment: 'Molt útil.' },
        { group: 'ASIX1', rating: 2, comment: 'No he entès res.' }
    ];

    const groups = ['DAW1A', 'DAW1B', 'ASIX1'];
    let currentFilter = 'DAW1A';

    // DOM Elements
    const form = document.getElementById('survey-form');
    const filterSelect = document.getElementById('filter-group');
    const toast = document.getElementById('toast');
    
    // Initialize Dashboard with starting filter
    updateDashboard();

    // Event Listener for the form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const group = document.getElementById('group-select').value;
        const rating = parseInt(document.getElementById('rating').value);
        const comment = document.getElementById('comments').value;

        // Add new response to the beginning
        surveys.unshift({ group, rating, comment });
        
        // Reset form but keep the selected group
        form.reset();
        document.getElementById('group-select').value = group;
        
        // Show success notification
        showToast();
        
        // Update all visual elements
        updateDashboard();
    });

    // Event Listener for changing the group filter
    filterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        document.getElementById('current-filter-display').textContent = currentFilter;
        updateDashboard();
    });

    // Helper: Show Toast
    function showToast() {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Main Update Function
    function updateDashboard() {
        // Apply filter
        const filteredSurveys = currentFilter === 'Tots' 
            ? surveys 
            : surveys.filter(s => s.group === currentFilter);

        calculateKPIs(filteredSurveys);
        renderBarCharts(filteredSurveys);
        renderPieCharts(filteredSurveys);
        renderComparison();
        renderResponses(filteredSurveys);
    }

    // Render KPIs
    function calculateKPIs(data) {
        const total = data.length;
        document.getElementById('kpi-responses').textContent = total;
        
        if (total === 0) {
            document.getElementById('kpi-average').textContent = '0.00';
            document.getElementById('kpi-positives').textContent = '0.0%';
            document.getElementById('kpi-group').textContent = currentFilter;
            return;
        }

        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        const avg = sum / total;
        document.getElementById('kpi-average').textContent = avg.toFixed(2);

        const positives = data.filter(s => s.rating >= 4).length;
        const posPerc = (positives / total) * 100;
        document.getElementById('kpi-positives').textContent = posPerc.toFixed(1) + '%';
        
        document.getElementById('kpi-group').textContent = currentFilter;
    }

    // Render Rating Distribution Bars
    function renderBarCharts(data) {
        const container = document.getElementById('bar-charts-container');
        container.innerHTML = '';
        
        const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
        data.forEach(s => counts[s.rating]++);
        
        const maxCount = Math.max(...Object.values(counts), 1);
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

        for(let i=1; i<=5; i++) {
            const count = counts[i];
            const width = (count / maxCount) * 100;
            
            const row = document.createElement('div');
            row.className = 'bar-row';
            row.innerHTML = `
                <div class="bar-label">${i} estrelles</div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${width}%; background-color: ${colors[i-1]};"></div>
                </div>
                <div class="bar-count">${count}</div>
            `;
            container.appendChild(row);
        }
    }

    // Render Pure CSS Conic Gradient Pie Charts
    function renderPieCharts(data) {
        const total = data.length;
        const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
        data.forEach(s => counts[s.rating]++);
        
        const pieScores = document.getElementById('pie-scores');
        const legendScores = document.getElementById('legend-scores');
        legendScores.innerHTML = '';
        
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
        
        // 1. Scores Pie Chart
        if (total > 0) {
            let gradientParts = [];
            let currentPerc = 0;
            
            for(let i=1; i<=5; i++) {
                if(counts[i] > 0) {
                    const perc = (counts[i] / total) * 100;
                    gradientParts.push(`${colors[i-1]} ${currentPerc}% ${currentPerc + perc}%`);
                    currentPerc += perc;
                    
                    legendScores.innerHTML += `
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: ${colors[i-1]}"></div>
                            <span>${i}/5: ${counts[i]} (${perc.toFixed(1)}%)</span>
                        </div>
                    `;
                }
            }
            pieScores.style.background = \`conic-gradient(\${gradientParts.join(', ')})\`;
        } else {
            pieScores.style.background = 'conic-gradient(#e2e8f0 0% 100%)';
            legendScores.innerHTML = '<span>Sense dades</span>';
        }

        // 2. Positives Pie Chart
        const piePos = document.getElementById('pie-positives');
        const legendPos = document.getElementById('legend-positives');
        legendPos.innerHTML = '';

        if (total > 0) {
            const posCount = counts[4] + counts[5];
            const negCount = total - posCount;
            const posPerc = (posCount / total) * 100;
            const negPerc = (negCount / total) * 100;

            piePos.style.background = \`conic-gradient(#22c55e 0% \${posPerc}%, #f97316 \${posPerc}% 100%)\`;
            
            legendPos.innerHTML = `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #22c55e"></div>
                    <span>Positives (4-5): ${posPerc.toFixed(1)}%</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #f97316"></div>
                    <span>No positives (1-3): ${negPerc.toFixed(1)}%</span>
                </div>
            `;
        } else {
            piePos.style.background = 'conic-gradient(#e2e8f0 0% 100%)';
            legendPos.innerHTML = '<span>Sense dades</span>';
        }
    }

    // Render Comparison Chart between Groups
    function renderComparison() {
        const container = document.getElementById('comparison-container');
        container.innerHTML = '';
        
        groups.forEach(group => {
            const groupSurveys = surveys.filter(s => s.group === group);
            let avg = 0;
            if (groupSurveys.length > 0) {
                const sum = groupSurveys.reduce((acc, curr) => acc + curr.rating, 0);
                avg = sum / groupSurveys.length;
            }
            
            const width = (avg / 5) * 100;
            const isSelected = group === currentFilter;
            const bgColor = isSelected ? 'var(--primary)' : '#94a3b8';
            
            const row = document.createElement('div');
            row.className = 'bar-row';
            row.innerHTML = `
                <div class="bar-label" style="width: 140px;">${group} ${isSelected ? '(seleccionat)' : ''}</div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${width}%; background-color: ${bgColor};"></div>
                </div>
                <div class="bar-count" style="width: 60px;">${avg.toFixed(2)}/5</div>
            `;
            container.appendChild(row);
        });
    }

    // Render List of Responses
    function renderResponses(data) {
        const container = document.getElementById('responses-list');
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted)">Encara no hi ha respostes per a aquest grup.</p>';
            return;
        }

        data.forEach(s => {
            let colorStyles = '';
            // Colores semánticos para las tarjetas
            if (s.rating <= 2) {
                colorStyles = 'border-left: 4px solid #ef4444; background-color: #fef2f2;';
            } else if (s.rating === 3) {
                colorStyles = 'border-left: 4px solid #eab308; background-color: #fefce8;';
            } else {
                colorStyles = 'border-left: 4px solid #22c55e; background-color: #f0fdf4;';
            }

            const card = document.createElement('div');
            card.className = 'response-card';
            card.style = colorStyles;
            card.innerHTML = `
                <div class="response-header">
                    <span class="response-group">${s.group}</span>
                    <span class="response-rating">Puntuació: ${s.rating}/5</span>
                </div>
                ${s.comment ? \`<p class="response-comment"><strong>Comentari:</strong> \${s.comment}</p>\` : ''}
            `;
            container.appendChild(card);
        });
    }
});
