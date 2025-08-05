document.addEventListener('DOMContentLoaded', function() {
    const appointmentsList = document.getElementById('appointments-list');
    const newAppointmentBtn = document.getElementById('new-appointment-btn');
    const appointmentModal = document.getElementById('appointment-modal');
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentDate = document.getElementById('appointment-date');
    const appointmentTime = document.getElementById('appointment-time');
    const appointmentDoctor = document.getElementById('appointment-doctor');
    const appointmentModalTitle = document.getElementById('appointment-modal-title');

    let appointments = JSON.parse(localStorage.getItem('patientAppointments')) || [];

    function loadAppointments() {
        appointmentsList.innerHTML = '';
        
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<li>Nenhuma consulta agendada</li>';
            return;
        }

        appointments.forEach((appointment, index) => {
            const li = document.createElement('li');
            li.className = 'appointment-item';
            li.innerHTML = `
                <div class="appointment-info">
                    <span class="date">${formatDate(appointment.date)} - ${appointment.time}</span>
                    <span class="doctor">${appointment.doctor}</span>
                </div>
                <div class="appointment-actions">
                    <button class="edit-appointment" data-index="${index}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-appointment" data-index="${index}">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;
            appointmentsList.appendChild(li);
        });

        document.querySelectorAll('.edit-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => editAppointment(e.target.closest('button').dataset.index));
        });

        document.querySelectorAll('.delete-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => deleteAppointment(e.target.closest('button').dataset.index));
        });
    }

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    function openAppointmentModal(index = null) {
        if (index !== null) {
            const appointment = appointments[index];
            appointmentDate.value = appointment.date;
            appointmentTime.value = appointment.time;
            appointmentDoctor.value = appointment.doctor;
            appointmentForm.dataset.editIndex = index;
            appointmentModalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Consulta';
        } else {
            appointmentForm.reset();
            delete appointmentForm.dataset.editIndex;
            appointmentModalTitle.innerHTML = '<i class="fas fa-calendar-plus"></i> Marcar Consulta';
        }
        appointmentModal.style.display = 'flex';
    }

    function saveAppointment(e) {
        e.preventDefault();
        
        const appointmentData = {
            date: appointmentDate.value,
            time: appointmentTime.value,
            doctor: appointmentDoctor.value
        };

        if (!appointmentData.date || !appointmentData.time || !appointmentData.doctor) {
            alert('Preencha todos os campos!');
            return;
        }

        if (appointmentForm.dataset.editIndex !== undefined) {
            const index = appointmentForm.dataset.editIndex;
            appointments[index] = appointmentData;
        } else {
            appointments.push(appointmentData);
        }

        localStorage.setItem('patientAppointments', JSON.stringify(appointments));
        loadAppointments();
        appointmentModal.style.display = 'none';
        alert('Consulta salva com sucesso!');
    }

    function editAppointment(index) {
        openAppointmentModal(index);
    }

    function deleteAppointment(index) {
        if (confirm('Tem certeza que deseja excluir esta consulta?')) {
            appointments.splice(index, 1);
            localStorage.setItem('patientAppointments', JSON.stringify(appointments));
            loadAppointments();
            alert('Consulta excluída com sucesso!');
        }
    }

    newAppointmentBtn.addEventListener('click', () => openAppointmentModal());
    appointmentForm.addEventListener('submit', saveAppointment);

    document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    loadAppointments();

});
