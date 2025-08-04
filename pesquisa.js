document.addEventListener('DOMContentLoaded', function() {
    const professionals = [
        {
            id: 1,
            name: "Dra. Ana Souza",
            specialty: "Psicóloga Clínica",
            expertise: "Depressão e Ansiedade",
            location: "São Paulo, SP",
            modality: "Online e Presencial",
            rating: 4.9,
            reviews: 128,
            available: true,
            avatar: "img/professionals/ana-souza.jpg"
        },
        {
            id: 2,
            name: "Dr. Carlos Pereira",
            specialty: "Psiquiatra",
            expertise: "Transtornos de Ansiedade",
            location: "Rio de Janeiro, RJ",
            modality: "Presencial",
            rating: 4.8,
            reviews: 95,
            available: true,
            avatar: "img/professionals/carlos-pereira.jpg"
        },
        {
            id: 3,
            name: "Dra. Mariana Oliveira",
            specialty: "Psicóloga",
            expertise: "Terapia Cognitivo-Comportamental",
            location: "Belo Horizonte, MG",
            modality: "Online",
            rating: 4.7,
            reviews: 76,
            available: true,
            avatar: "img/professionals/mariana-oliveira.jpg"
        },
        {
            id: 4,
            name: "Dr. Ricardo Fernandes",
            specialty: "Psiquiatra",
            expertise: "TDAH em Adultos",
            location: "Porto Alegre, RS",
            modality: "Online e Presencial",
            rating: 4.9,
            reviews: 112,
            available: false,
            avatar: "img/professionals/ricardo-fernandes.jpg"
        },
        {
            id: 5,
            name: "Dra. Juliana Santos",
            specialty: "Psicóloga",
            expertise: "Estresse Pós-Traumático",
            location: "Curitiba, PR",
            modality: "Online",
            rating: 4.8,
            reviews: 64,
            available: true,
            avatar: "img/professionals/juliana-santos.jpg"
        },
        {
            id: 6,
            name: "Dr. Pedro Henrique",
            specialty: "Psiquiatra",
            expertise: "Esquizofrenia",
            location: "Salvador, BA",
            modality: "Presencial",
            rating: 4.6,
            reviews: 42,
            available: true,
            avatar: "img/professionals/pedro-henrique.jpg"
        },
        {
            id: 7,
            name: "Dra. Fernanda Costa",
            specialty: "Psicóloga",
            expertise: "Terapia de Casal",
            location: "Recife, PE",
            modality: "Online",
            rating: 4.7,
            reviews: 88,
            available: true,
            avatar: "img/professionals/fernanda-costa.jpg"
        },
        {
            id: 8,
            name: "Dr. Lucas Martins",
            specialty: "Psiquiatra",
            expertise: "Transtornos Alimentares",
            location: "Fortaleza, CE",
            modality: "Online e Presencial",
            rating: 4.9,
            reviews: 105,
            available: false,
            avatar: "img/professionals/lucas-martins.jpg"
        }
    ];

    const professionalsList = document.getElementById('professionals-list');
    const searchInput = document.querySelector('.search-input input');
    const searchBtn = document.querySelector('.search-btn');
    const specialtyFilter = document.getElementById('specialty');
    const locationFilter = document.getElementById('location');
    const modalityFilter = document.getElementById('modality');

    function loadProfessionals(filter = '') {
        professionalsList.innerHTML = '';
        
        const specialtyValue = specialtyFilter.value;
        const locationValue = locationFilter.value;
        const modalityValue = modalityFilter.value;

        const filtered = professionals.filter(prof => {
            const matchesSearch = 
                prof.name.toLowerCase().includes(filter.toLowerCase()) ||
                prof.specialty.toLowerCase().includes(filter.toLowerCase()) ||
                prof.expertise.toLowerCase().includes(filter.toLowerCase()) ||
                prof.location.toLowerCase().includes(filter.toLowerCase());
            
            const matchesSpecialty = !specialtyValue || 
                (specialtyValue === 'psicologo' && prof.specialty.includes('Psicólog')) ||
                (specialtyValue === 'psiquiatra' && prof.specialty.includes('Psiquiatra')) ||
                (specialtyValue === 'terapeuta' && prof.specialty.includes('Terapeuta'));
            
            const matchesLocation = !locationValue || 
                (locationValue === 'sp' && prof.location.includes('São Paulo')) ||
                (locationValue === 'rj' && prof.location.includes('Rio de Janeiro')) ||
                (locationValue === 'mg' && prof.location.includes('Belo Horizonte'));
            
            const matchesModality = !modalityValue || 
                (modalityValue === 'presencial' && prof.modality.includes('Presencial')) ||
                (modalityValue === 'online' && prof.modality.includes('Online'));

            return matchesSearch && matchesSpecialty && matchesLocation && matchesModality;
        });

        if (filtered.length === 0) {
            professionalsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-user-md"></i>
                    <h3>Nenhum profissional encontrado</h3>
                    <p>Tente ajustar seus filtros de busca</p>
                </div>
            `;
            return;
        }

        filtered.forEach(professional => {
            const card = document.createElement('div');
            card.className = 'professional-card';
            card.innerHTML = `
                <div class="professional-header">
                    <div class="professional-avatar">
                        <img src="${professional.avatar}" alt="${professional.name}">
                    </div>
                </div>
                <div class="professional-body">
                    <h3 class="professional-name">${professional.name}</h3>
                    <p class="professional-specialty">${professional.specialty}</p>
                    <p class="professional-expertise">
                        <i class="fas fa-certificate"></i> ${professional.expertise}
                    </p>
                    <p class="professional-location">
                        <i class="fas fa-map-marker-alt"></i> ${professional.location}
                    </p>
                    <div class="professional-rating">
                        <div class="stars">
                            ${'<i class="fas fa-star"></i>'.repeat(Math.floor(professional.rating))}
                            ${professional.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        </div>
                        <span>${professional.rating} (${professional.reviews} avaliações)</span>
                    </div>
                    <p class="professional-modality">
                        <i class="fas fa-video"></i> ${professional.modality}
                    </p>
                </div>
                <div class="professional-footer">
                    <button class="btn-profile ${professional.available ? '' : 'disabled'}" 
                            ${professional.available ? '' : 'disabled'}>
                        ${professional.available ? 'Ver Perfil Completo' : 'Indisponível'}
                    </button>
                </div>
            `;
            professionalsList.appendChild(card);
        });
    }

    searchBtn.addEventListener('click', () => {
        loadProfessionals(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadProfessionals(searchInput.value);
        }
    });

    specialtyFilter.addEventListener('change', () => {
        loadProfessionals(searchInput.value);
    });

    locationFilter.addEventListener('change', () => {
        loadProfessionals(searchInput.value);
    });

    modalityFilter.addEventListener('change', () => {
        loadProfessionals(searchInput.value);
    });

    loadProfessionals();
});