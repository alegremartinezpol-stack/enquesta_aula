document.addEventListener('DOMContentLoaded', () => {
    // Initial data matching the screenshot exactly
    let surveys = [
        { group: 'DAW1A', rating: 4, comment: 'La part de conclusions és interessant.' },
        { group: 'DAW1A', rating: 3, comment: 'Em va costar la part de gràfics.' },
        { group: 'DAW1A', rating: 4, comment: 'Les demos han ajudat molt.' },
        { group: 'DAW1A', rating: 5, comment: 'Molt bona feina del professorat.' },
        { group: 'DAW1A', rating: 2, comment: 'Hauria anat bé més feedback individual.' },
        { group: 'DAW1A', rating: 4, comment: 'Contingut ben estructurat.' },
        { group: 'DAW1A', rating: 3, comment: 'Faltaven més casos reals.' },
        { group: 'DAW1A', rating: 5, comment: "Genial per entendre l'analítica." },
        { group: 'DAW1A', rating: 5, comment: "Activitat molt útil per l'examen." },
        { group: 'DAW1A', rating: 3, comment: 'Caldria més exemples guiats.' },
        { group: 'DAW1A', rating: 2, comment: 'Sense comentari' },
        { group: 'DAW1A', rating: 4, comment: 'Sessió clara i pràctica.' },
        
        { group: 'DAW1B', rating: 4, comment: 'Bé.' },
        { group: 'DAW1B', rating: 3, comment: 'Normal.' },
        { group: 'ASIX1', rating: 5, comment: 'Molt útil.' },
        { group: 'ASIX1', rating: 2, comment: 'No he entès res.' }
    ];

    const groups = ['DAW1A', 'DAW1B', 'ASIX1'];
    
    let currentFilter = 'DAW1A';

    const form = document.getElementById('survey-form');
    const filterSelect = document.getElementById('filter-group');
    
    filterSelect.value = currentFilter;
    
    updateDashboard();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const group = document.getElementById('group-select').value;
        const rating = parseInt(document.getElementById('rating').value);
        const comment = document.getElementById('comments').value;

        surveys.unshift({ group, rating, comment });
        
        form.reset();
        document.getElementById('group-select').value = group;
        
        updateDashboard();
    });

    filterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        document.getElementById('current-filter-display').textContent = currentFilter;
        updateDashboard();
    });

    function updateDashboard() {
        const filteredSurveys = currentFilter === 'Tots' 
            ? surveys 
            : surveys.filter(s => s.group === currentFilter);

        calculateKPIs(filteredSurveys);
        renderBarCharts(filteredSurveys);
        renderPieCharts(filteredSurveys);
        renderComparison();
        renderResponses(filteredSurveys);
    }

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

    function renderBarCharts(data) {
        const container = document.getElementById('bar-charts-container');
        container.innerHTML = '';
        
        const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
        data.forEach(s => counts[s.rating]++);
        
        let maxCount = Math.max(...Object.values(counts));
        if (maxCount === 0) maxCount = 1;

        for(let i=1; i<=5; i++) {
            const count = counts[i];
            const width = (count / maxCount) * 100;
            
            const row = document.createElement('div');
            row.className = 'bar-row';
            row.innerHTML = `
                <div class="bar-label">${i} estrelles</div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${width}%;"></div>
                </div>
                <div class="bar-count">${count}</div>
            `;
            container.appendChild(row);
        }
    }

    function renderPieCharts(data) {
        const total = data.length;
        const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
        data.forEach(s => counts[s.rating]++);
        
        const pieScores = document.getElementById('pie-scores');
        const legendScores = document.getElementById('legend-scores');
        legendScores.innerHTML = '';
        
        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#198754'];
        
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
            pieScores.style.background = `conic-gradient(${gradientParts.join(', ')})`;
        } else {
            pieScores.style.background = 'conic-gradient(#e9ecef 0% 100%)';
        }

        const piePos = document.getElementById('pie-positives');
        const legendPos = document.getElementById('legend-positives');
        legendPos.innerHTML = '';

        if (total > 0) {
            const posCount = counts[4] + counts[5];
            const negCount = total - posCount;
            const posPerc = (posCount / total) * 100;
            const negPerc = (negCount / total) * 100;

            piePos.style.background = `conic-gradient(#198754 0% ${posPerc}%, #fd7e14 ${posPerc}% 100%)`;
            
            legendPos.innerHTML = `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #198754"></div>
                    <span>Positives (4-5): ${posPerc.toFixed(1)}%</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #fd7e14"></div>
                    <span>No positives (1-3): ${negPerc.toFixed(1)}%</span>
                </div>
            `;
        } else {
            piePos.style.background = 'conic-gradient(#e9ecef 0% 100%)';
        }
    }

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
            
            const row = document.createElement('div');
            row.className = 'bar-row';
            row.innerHTML = `
                <div class="bar-label">${group} ${isSelected ? '(seleccionat)' : ''}</div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${width}%;"></div>
                </div>
                <div class="bar-count">${avg.toFixed(2)}/5</div>
            `;
            container.appendChild(row);
        });
    }

    function renderResponses(data) {
        const container = document.getElementById('responses-list');
        container.innerHTML = '';

        data.forEach(s => {
            let type = 'negative';
            if (s.rating >= 4) type = 'positive';
            else if (s.rating === 3) type = 'neutral';

            const card = document.createElement('div');
            card.className = `response-card ${type}`;
            card.innerHTML = `
                <div class="response-group">${s.group}</div>
                <div class="response-rating">Puntuació: ${s.rating}/5</div>
                ${s.comment ? `<div class="response-comment">Comentari: ${s.comment}</div>` : ''}
            `;
            container.appendChild(card);
        });
    }
});
