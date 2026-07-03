export function resolvePatientServiceId(patient) {
    if (!patient || typeof patient !== 'object') return 'poli_umum';
    if (patient.isEmergency) return 'igd';
    return patient.serviceId || patient.facility || 'poli_umum';
}

export function isPatientAssignedToService(patient, serviceId) {
    return resolvePatientServiceId(patient) === (serviceId || 'poli_umum');
}

export function filterQueueByService(queue = [], serviceId) {
    return (queue || []).filter((patient) => isPatientAssignedToService(patient, serviceId));
}

export function isClinicalServiceOpen(service, time) {
    if (!service || service.queueType !== 'queue') return true;
    return time >= 480 && time < 960;
}
