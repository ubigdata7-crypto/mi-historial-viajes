document.addEventListener('DOMContentLoaded', () => {
    const travelForm = document.getElementById('travel-form');
    const travelTableBody = document.querySelector('#travel-table tbody');
    const totalKmElement = document.getElementById('total-km');
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    const transporteSelect = document.getElementById('transporte');
    const languageSelector = document.getElementById('language-selector');
    const suggestionsOrigen = document.getElementById('suggestions-origen');
    const suggestionsDestino = document.getElementById('suggestions-destino');
    
    let currentLanguage = localStorage.getItem('language') || 'es';

    const translations = {
        es: {
            title: "Mi Historial de Viajes", desc: "Añade y gestiona todos tus viajes.", formTitle: "Agregar Nuevo Viaje", 
            lFecha: "Fecha de salida:", lOrigen: "Origen:", lDestino: "Destino:", lTransporte: "Medio de transporte:", 
            oAuto: "Auto", oAvion: "Avión", oBarco: "Barco", btnSave: "Guardar Viaje", btnUpdate: "Actualizar Viaje", 
            mapTitle: "Mapa de Viajes", histTitle: "Historial de Viajes", hFecha: "Fecha", hOrigen: "Origen", 
            hDestino: "Destino", hTrans: "Transporte", hKm: "Km", hAcciones: "Acciones", tKm: "Total de km recorridos:", 
            errCoords: "No se encontró una de las ciudades. Escribe el nombre completo.", confirmDel: "¿Eliminar este viaje?", 
            editBtn: "Editar", delBtn: "Eliminar", btnExport: "⬇️ Exportar Datos", btnImport: "⬆️ Importar Datos",
            alertNoExport: "No hay viajes para exportar.", alertImportSuccess: "Se importaron {n} viajes correctamente.",
            alertImportFormat: "El archivo no tiene el formato correcto.", alertImportError: "Error al leer el archivo."
        },
        en: {
            title: "My Travel History", desc: "Add and manage all your trips.", formTitle: "Add New Trip", 
            lFecha: "Departure date:", lOrigen: "Origin:", lDestino: "Destination:", lTransporte: "Means of transport:", 
            oAuto: "Car", oAvion: "Plane", oBarco: "Boat", btnSave: "Save Trip", btnUpdate: "Update Trip", 
            mapTitle: "Travel Map", histTitle: "Travel History", hFecha: "Date", hOrigen: "Origin", 
            hDestino: "Destination", hTrans: "Transport", hKm: "Km", hAcciones: "Actions", tKm: "Total Km traveled:", 
            errCoords: "Could not find coordinates for one or both cities.", confirmDel: "Are you sure you want to delete this trip?", 
            editBtn: "Edit", delBtn: "Delete", btnExport: "⬇️ Export Data", btnImport: "⬆️ Import Data",
            alertNoExport: "No trips to export.", alertImportSuccess: "Successfully imported {n} trips.",
            alertImportFormat: "Invalid file format.", alertImportError: "Error reading file."
        },
        fr: {
            title: "Mon historique de voyages", desc: "Ajoutez et gérez tous vos voyages.", formTitle: "Ajouter un nouveau voyage", 
            lFecha: "Date de départ:", lOrigen: "Origine:", lDestino: "Destination:", lTransporte: "Moyen de transport:", 
            oAuto: "Voiture", oAvion: "Avion", oBarco: "Bateau", btnSave: "Enregistrer le voyage", btnUpdate: "Mettre à jour le voyage", 
            mapTitle: "Carte des voyages", histTitle: "Historique des voyages", hFecha: "Date", hOrigen: "Origine", 
            hDestino: "Destination", hTrans: "Transport", hKm: "Km", hAcciones: "Actions", tKm: "Total de km parcourus:", 
            errCoords: "Impossible de trouver les coordonnées d'une ou des deux villes.", confirmDel: "Êtes-vous sûr de vouloir supprimer ce voyage?", 
            editBtn: "Modifier", delBtn: "Supprimer", btnExport: "⬇️ Exporter", btnImport: "⬆️ Importer",
            alertNoExport: "Aucun voyage à exporter.", alertImportSuccess: "{n} voyages importés avec succès.",
            alertImportFormat: "Format de fichier invalide.", alertImportError: "Erreur de lecture du fichier."
        },
        pt: {
            title: "Meu Histórico de Viagens", desc: "Adicione e gerencie todas as suas viagens.", formTitle: "Adicionar Nova Viagem", 
            lFecha: "Data de partida:", lOrigen: "Origem:", lDestino: "Destino:", lTransporte: "Meio de transporte:", 
            oAuto: "Carro", oAvion: "Avião", oBarco: "Barco", btnSave: "Salvar Viagem", btnUpdate: "Atualizar Viagem", 
            mapTitle: "Mapa de Viagens", histTitle: "Histórico de Viagens", hFecha: "Data", hOrigen: "Origem", 
            hDestino: "Destino", hTrans: "Transporte", hKm: "Km", hAcciones: "Ações", tKm: "Total de km percorridos:", 
            errCoords: "Não foi possível encontrar as coordenadas.", confirmDel: "Tem certeza de que deseja excluir esta viagem?", 
            editBtn: "Editar", delBtn: "Excluir", btnExport: "⬇️ Exportar Dados", btnImport: "⬆️ Importar Dados",
            alertNoExport: "Nenhuma viagem para exportar.", alertImportSuccess: "{n} viagens importadas com sucesso.",
            alertImportFormat: "Formato de arquivo inválido.", alertImportError: "Erro ao ler o arquivo."
        }
    };

    const setLanguage = (lang) => {
        const t = translations[lang] || translations['es'];
        document.getElementById('app-title').textContent = t.title;
        document.getElementById('app-description').textContent = t.desc;
        document.getElementById('form-title').textContent = t.formTitle;
        document.getElementById('label-fecha').textContent = t.lFecha;
        document.getElementById('label-origen').textContent = t.lOrigen;
        document.getElementById('label-destino').textContent = t.lDestino;
        document.getElementById('label-transporte').textContent = t.lTransporte;
        
        transporteSelect.querySelector('option[value="auto"]').textContent = t.oAuto;
        transporteSelect.querySelector('option[value="avion"]').textContent = t.oAvion;
        transporteSelect.querySelector('option[value="barco"]').textContent = t.oBarco;
        
        if (travelForm.dataset.editing) {
            document.getElementById('save-button').textContent = t.btnUpdate;
        } else {
            document.getElementById('save-button').textContent = t.btnSave;
        }
        
        document.getElementById('map-title').textContent = t.mapTitle;
        document.getElementById('history-title').textContent = t.histTitle;
        
        document.getElementById('header-fecha').textContent = t.hFecha;
        document.getElementById('header-origen').textContent = t.hOrigen;
        document.getElementById('header-destino').textContent = t.hDestino;
        document.getElementById('header-transporte').textContent = t.hTrans;
        document.getElementById('header-km').textContent = t.hKm;
        document.getElementById('header-acciones').textContent = t.hAcciones;

        // Nuevos botones de importación/exportación
        document.getElementById('btn-export').textContent = t.btnExport;
        document.getElementById('btn-import').textContent = t.btnImport;

        renderTravels();
    };

    let travels = JSON.parse(localStorage.getItem('travels')) || [];
    
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    setTimeout(() => { map.invalidateSize(); }, 500);

    const getCoordinates = async (city) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
            const data = await res.json();
            if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            return null;
        } catch (e) { return null; }
    };

    const getSuggestions = async (query, container, inputField) => {
        if (query.length < 3) { container.innerHTML = ''; return; }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();
            container.innerHTML = '';
            if (data.length > 0) {
                const ul = document.createElement('ul');
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.display_name;
                    li.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        inputField.value = item.display_name;
                        container.innerHTML = '';
                    });
                    ul.appendChild(li);
                });
                container.appendChild(ul);
            }
        } catch (e) { container.innerHTML = ''; }
    };

    const getDrivingRoute = async (c1, c2) => {
        try {
            const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${c1[1]},${c1[0]};${c2[1]},${c2[0]}?overview=full&geometries=geojson`);
            const data = await res.json();
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                return { km: (route.distance / 1000).toFixed(2), ruta: route.geometry.coordinates.map(c => [c[1], c[0]]) };
            }
            return null;
        } catch (e) { return null; }
    };

    const getStraightDistance = (c1, c2) => (L.latLng(c1[0], c1[1]).distanceTo(L.latLng(c2[0], c2[1])) / 1000).toFixed(2);

    const drawTravelsOnMap = () => {
        map.eachLayer((layer) => { if (layer instanceof L.Polyline || layer instanceof L.Marker) map.removeLayer(layer); });
        let allCoords = [];
        travels.forEach(t => {
            if (t.coordsOrigen && t.coordsDestino) {
                let color = t.transporte === 'auto' ? '#ff4757' : t.transporte === 'barco' ? '#2ed573' : '#1e90ff';
                if (t.transporte === 'auto' && t.ruta && t.ruta.length > 0) {
                    L.polyline(t.ruta, { color: color, weight: 3 }).addTo(map);
                } else {
                    L.polyline([t.coordsOrigen, t.coordsDestino], { color: color, weight: 3, dashArray: t.transporte === 'avion' ? '5, 10' : null }).addTo(map);
                }
                L.marker(t.coordsOrigen).addTo(map).bindPopup(t.origen);
                L.marker(t.coordsDestino).addTo(map).bindPopup(t.destino);
                allCoords.push(t.coordsOrigen, t.coordsDestino);
            }
        });
        if (allCoords.length > 0) map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] });
    };

    const renderTravels = () => {
        travelTableBody.innerHTML = '';
        let totalKm = 0;
        travels.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        
        travels.forEach((t) => {
            const row = document.createElement('tr');
            const icon = t.transporte === 'auto' ? '🚗' : t.transporte === 'barco' ? '⛴️' : '✈️';
            const tDict = translations[currentLanguage] || translations['es'];
            
            row.innerHTML = `
                <td>${t.fecha}</td><td>${t.origen}</td><td>${t.destino}</td><td>${icon}</td><td>${t.km}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${t.id}">${tDict.editBtn}</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${t.id}">${tDict.delBtn}</button>
                </td>`;
            travelTableBody.appendChild(row);
            totalKm += parseFloat(t.km || 0);
        });
        const trans = translations[currentLanguage] || translations['es'];
        totalKmElement.textContent = `${trans.tKm} ${totalKm.toFixed(2)} km`;
        drawTravelsOnMap();
    };

    const saveTravel = async (e) => {
        e.preventDefault();
        const btnSave = document.getElementById('save-button');
        btnSave.disabled = true;
        btnSave.textContent = "...";

        const tDict = translations[currentLanguage] || translations['es'];
        const fecha = document.getElementById('fecha').value;
        const origen = origenInput.value;
        const destino = destinoInput.value;
        const transporte = transporteSelect.value;
        
        const coordsOrigen = await getCoordinates(origen);
        const coordsDestino = await getCoordinates(destino);
        
        let km = 0; let ruta = null;

        if (coordsOrigen && coordsDestino) {
            if (transporte === 'auto') {
                const dRes = await getDrivingRoute(coordsOrigen, coordsDestino);
                if (dRes) { km = dRes.km; ruta = dRes.ruta; } 
                else { km = getStraightDistance(coordsOrigen, coordsDestino); }
            } else { km = getStraightDistance(coordsOrigen, coordsDestino); }
        } else {
            alert(tDict.errCoords);
            btnSave.disabled = false;
            btnSave.textContent = travelForm.dataset.editing ? tDict.btnUpdate : tDict.btnSave;
            return;
        }
        
        const editedId = travelForm.dataset.editing;
        const travelData = { id: editedId ? parseInt(editedId) : Date.now(), fecha, origen, destino, transporte, km, ruta, coordsOrigen, coordsDestino };

        if (editedId) {
            const index = travels.findIndex(t => t.id == editedId);
            if (index !== -1) travels[index] = travelData;
            travelForm.removeAttribute('data-editing');
        } else { travels.push(travelData); }

        localStorage.setItem('travels', JSON.stringify(travels));
        travelForm.reset();
        btnSave.disabled = false;
        btnSave.textContent = tDict.btnSave;
        renderTravels();
    };

    // Funciones Exportar / Importar
    document.getElementById('btn-export').addEventListener('click', () => {
        const tDict = translations[currentLanguage] || translations['es'];
        if (travels.length === 0) {
            alert(tDict.alertNoExport);
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(travels));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "mis_viajes.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    const fileImport = document.getElementById('file-import');
    document.getElementById('btn-import').addEventListener('click', () => fileImport.click());
    
    fileImport.addEventListener('change', (event) => {
        const tDict = translations[currentLanguage] || translations['es'];
        const file = event.target.files[0];
        if (!file) return;
        
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const importedTravels = JSON.parse(e.target.result);
                if (Array.isArray(importedTravels)) {
                    const currentIds = new Set(travels.map(t => t.id));
                    const newTravels = importedTravels.filter(t => !currentIds.has(t.id));
                    
                    travels = [...travels, ...newTravels];
                    localStorage.setItem('travels', JSON.stringify(travels));
                    renderTravels();
                    // Reemplaza el marcador {n} por el numero de viajes nuevos
                    alert(tDict.alertImportSuccess.replace('{n}', newTravels.length));
                } else {
                    alert(tDict.alertImportFormat);
                }
            } catch (error) {
                alert(tDict.alertImportError);
            }
            fileImport.value = '';
        };
        fileReader.readAsText(file);
    });

    // Eventos de autocompletado y botones de tabla
    let timeoutOrigen, timeoutDestino;
    origenInput.addEventListener('input', () => {
        clearTimeout(timeoutOrigen);
        timeoutOrigen = setTimeout(() => getSuggestions(origenInput.value, suggestionsOrigen, origenInput), 600);
    });
    destinoInput.addEventListener('input', () => {
        clearTimeout(timeoutDestino);
        timeoutDestino = setTimeout(() => getSuggestions(destinoInput.value, suggestionsDestino, destinoInput), 600);
    });
    document.addEventListener('mousedown', (e) => {
        if (!origenInput.contains(e.target) && !suggestionsOrigen.contains(e.target)) suggestionsOrigen.innerHTML = '';
        if (!destinoInput.contains(e.target) && !suggestionsDestino.contains(e.target)) suggestionsDestino.innerHTML = '';
    });

    travelForm.addEventListener('submit', saveTravel);
    
    travelTableBody.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const tDict = translations[currentLanguage] || translations['es'];
        if (e.target.classList.contains('delete-btn')) {
            if (confirm(tDict.confirmDel)) {
                travels = travels.filter(t => t.id != id);
                localStorage.setItem('travels', JSON.stringify(travels));
                renderTravels();
            }
        }
        if (e.target.classList.contains('edit-btn')) {
            const t = travels.find(tr => tr.id == id);
            if (t) {
                document.getElementById('fecha').value = t.fecha;
                origenInput.value = t.origen;
                destinoInput.value = t.destino;
                transporteSelect.value = t.transporte;
                travelForm.dataset.editing = t.id;
                document.getElementById('save-button').textContent = tDict.btnUpdate;
            }
        }
    });

    languageSelector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        setLanguage(currentLanguage);
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        });
    }

    languageSelector.value = currentLanguage;
    setLanguage(currentLanguage);
});
