document.addEventListener('DOMContentLoaded', () => {
    // Credencials de Supabase (Reemplaça-les amb les teves)
    const SUPABASE_URL = 'https://jyuovcpelfpvarkiewdg.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dW92Y3BlbGZwdmFya2lld2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNjYzMTgsImV4cCI6MjA5NDk0MjMxOH0.biqFpbgjm7EJaRTLPXMmR_XPfzSHVcmVXek8sezAeKs';

    let supabaseClient = null;
    if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // Dades inicials en català (Seed Data) amb format ISO
    let respostes = [
        { id: 1, grup: 'DAW1A', puntuacio: 4, comentari: 'La part de conclusions és interessant.', data: '2026-05-21T16:30:00' },
        { id: 2, grup: 'DAW1A', puntuacio: 3, comentari: 'Em va costar la part de gràfics.', data: '2026-05-21T16:15:00' },
        { id: 3, grup: 'DAW1A', puntuacio: 4, comentari: 'Les demos han ajudat molt.', data: '2026-05-21T16:00:00' },
        { id: 4, grup: 'DAW1A', puntuacio: 5, comentari: 'Molt bona feina del professorat.', data: '2026-05-21T15:45:00' },
        { id: 5, grup: 'DAW1A', puntuacio: 2, comentari: 'Hauria anat bé més feedback individual.', data: '2026-05-21T15:30:00' },
        { id: 6, grup: 'DAW1A', puntuacio: 4, comentari: 'Contingut ben estructurat.', data: '2026-05-21T15:15:00' },
        { id: 7, grup: 'DAW1A', puntuacio: 3, comentari: 'Faltaven més casos reals.', data: '2026-05-21T15:00:00' },
        { id: 8, grup: 'DAW1A', puntuacio: 5, comentari: "Genial per entendre l'analítica.", data: '2026-05-21T14:45:00' },
        { id: 9, grup: 'DAW1A', puntuacio: 5, comentari: "Activitat molt útil per l'examen.", data: '2026-05-21T14:30:00' },
        { id: 10, grup: 'DAW1A', puntuacio: 3, comentari: 'Caldria més exemples guiats.', data: '2026-05-21T14:15:00' },
        { id: 11, grup: 'DAW1A', puntuacio: 2, comentari: 'Sense comentari', data: '2026-05-21T14:00:00' },
        { id: 12, grup: 'DAW1A', puntuacio: 4, comentari: 'Sessió clara i pràctica.', data: '2026-05-21T13:45:00' },
        
        { id: 13, grup: 'DAW1B', puntuacio: 4, comentari: 'Bé.', data: '2026-05-21T12:30:00' },
        { id: 14, grup: 'DAW1B', puntuacio: 3, comentari: 'Normal.', data: '2026-05-21T12:15:00' },
        { id: 15, grup: 'ASIX1', puntuacio: 5, comentari: 'Molt útil.', data: '2026-05-21T11:00:00' },
        { id: 16, grup: 'ASIX1', puntuacio: 2, comentari: 'No he entès res.', data: '2026-05-21T10:45:00' }
    ];

    const groups = ['DAW1A', 'DAW1B', 'ASIX1'];
    let currentFilter = 'Tots';

    const form = document.getElementById('survey-form');
    const filterSelect = document.getElementById('filter-group');
    
    filterSelect.value = currentFilter;

    // Funció per carregar les respostes de Supabase (o mantenir locals)
    async function carregarDades() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('respostes')
                    .select('*')
                    .order('data', { ascending: false });
                
                if (error) throw error;
                if (data) {
                    respostes = data;
                }
            } catch (err) {
                console.warn("No s'han pogut obtenir dades de Supabase (comprova la consola SQL). Usant dades locals.", err);
            }
        }
        updateDashboard();
    }

    // Inicialitzar dades
    carregarDades();

    // Funció auxiliar per formatar data per a la interfície (DD/MM/YYYY HH:mm)
    function formatUIDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (e) {
            return dateStr;
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const grup = document.getElementById('group-select').value;
        const puntuacio = parseInt(document.getElementById('rating').value);
        const comentari = document.getElementById('comments').value.trim();
        
        // Obtenir data actual en format ISO local (YYYY-MM-DDTHH:mm:ss)
        const ara = new Date();
        const offsetMs = ara.getTimezoneOffset() * 60 * 1000;
        const dataLocal = new Date(ara.getTime() - offsetMs).toISOString().slice(0, 19);

        const novaResposta = {
            grup,
            puntuacio,
            comentari,
            data: dataLocal
        };

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('respostes')
                    .insert([novaResposta])
                    .select();
                
                if (error) throw error;
                if (data && data.length > 0) {
                    respostes.unshift(data[0]);
                }
            } catch (err) {
                console.error("Error inserint a Supabase:", err.message);
                // Fallback local si falla la connexió o no existeix la taula
                const nouId = respostes.length > 0 ? Math.max(...respostes.map(r => r.id)) + 1 : 1;
                respostes.unshift({ id: nouId, ...novaResposta });
            }
        } else {
            // Fallback local si no està configurat Supabase
            const nouId = respostes.length > 0 ? Math.max(...respostes.map(r => r.id)) + 1 : 1;
            respostes.unshift({ id: nouId, ...novaResposta });
        }
        
        form.reset();
        document.getElementById('group-select').value = grup;
        
        updateDashboard();
    });

    filterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        updateDashboard();
    });

    function updateDashboard() {
        const filteredSurveys = currentFilter === 'Tots' 
            ? respostes 
            : respostes.filter(s => s.grup === currentFilter);

        document.getElementById('current-filter-display').textContent = currentFilter;
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

        const sum = data.reduce((acc, curr) => acc + curr.puntuacio, 0);
        const avg = sum / total;
        document.getElementById('kpi-average').textContent = avg.toFixed(2);

        const positives = data.filter(s => s.puntuacio >= 4).length;
        const posPerc = (positives / total) * 100;
        document.getElementById('kpi-positives').textContent = posPerc.toFixed(1) + '%';
        
        document.getElementById('kpi-group').textContent = currentFilter;
    }

    function renderBarCharts(data) {
        const container = document.getElementById('bar-charts-container');
        container.innerHTML = '';
        
        const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
        data.forEach(s => counts[s.puntuacio]++);
        
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
        data.forEach(s => counts[s.puntuacio]++);
        
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
            const groupSurveys = respostes.filter(s => s.grup === group);
            let avg = 0;
            if (groupSurveys.length > 0) {
                const sum = groupSurveys.reduce((acc, curr) => acc + curr.puntuacio, 0);
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
            if (s.puntuacio >= 4) type = 'positive';
            else if (s.puntuacio === 3) type = 'neutral';

            const card = document.createElement('div');
            card.className = `response-card ${type}`;
            card.innerHTML = `
                <div class="response-header">
                    <span class="response-group">${s.grup}</span>
                    <span class="response-date">${formatUIDate(s.data)}</span>
                </div>
                <div class="response-rating">Puntuació: ${s.puntuacio}/5</div>
                ${s.comentari ? `<div class="response-comment">${s.comentari}</div>` : ''}
            `;
            container.appendChild(card);
        });
    }
});
