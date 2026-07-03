import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();
let currentLanguage = 'id';

const translations = {
    id: {
        'clinical.workflow_metric_program_value': ({ count = 0 }) => `${count} pasien Prolanis`,
        'clinical.workflow_call_next': 'Panggil pasien berikutnya',
        'clinical.workflow_take_case': 'Tangani sekarang',
        'clinical.workflow_ready_queue_title': 'Pelayanan siap. Panggil pasien berikutnya.',
        'clinical.workflow_wait_compact': ({ minutes = 0 }) => `${minutes}m menunggu`,
        'queue.age_compact': ({ age }) => `${age} th`,
        'playerSetup.genders.female': 'Perempuan',
        'playerSetup.genders.male': 'Laki-laki',
        'clinical.resident': 'Warga',
        'clinical.visitor': 'Pendatang',
        'queue.general': 'Umum',
        'queue.service_fallback': 'Poli Umum'
    },
    en: {
        'clinical.workflow_metric_program_value': ({ count = 0 }) => `${count} Prolanis patients`,
        'clinical.workflow_call_next': 'Call next patient',
        'clinical.workflow_take_case': 'Handle now',
        'clinical.workflow_ready_queue_title': 'Clinic is ready. Call the next patient.',
        'clinical.workflow_wait_compact': ({ minutes = 0 }) => `${minutes}m waiting`,
        'clinical.mobile_queue_waiting': ({ count = 0 }) => `${count} patients ready to call`,
        'clinical.mobile_queue_hint': 'Use this entry point to jump straight into the main clinic workflow.',
        'clinical.mobile_queue_cta': 'Open queue',
        'clinical.mobile_queue_preview': 'Up next',
        'queue.age_compact': ({ age }) => `${age} y.o.`,
        'playerSetup.genders.female': 'Female',
        'playerSetup.genders.male': 'Male',
        'clinical.resident': 'Resident',
        'clinical.visitor': 'Visitor',
        'queue.general': 'General',
        'queue.service_fallback': 'General Clinic'
    }
};

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../context/ThemeContext.jsx', () => ({
    useTheme: () => ({ isDark: false })
}));

vi.mock('react-i18next', () => ({
    initReactI18next: {
        type: '3rdParty',
        init: () => {}
    },
    useTranslation: () => ({
        t: (key, options = {}) => {
            const translation = translations[currentLanguage]?.[key];
            if (typeof translation === 'function') return translation(options);
            return translation ?? key;
        }
    })
}));

vi.mock('../components/QueueList.jsx', () => ({
    default: () => <div>QueueListMock</div>
}));

vi.mock('../components/PatientEMR.jsx', () => ({
    default: () => <div>PatientEMRMock</div>
}));

vi.mock('../components/KPIDashboard.jsx', () => ({
    default: () => <div>KPIDashboardMock</div>
}));

vi.mock('../components/EmergencyPanel.jsx', () => ({
    default: () => <div>EmergencyPanelMock</div>,
    EmergencyEMR: () => <div>EmergencyEMRMock</div>
}));

vi.mock('../components/ProlanisPanel.jsx', () => ({
    default: () => <div>ProlanisPanelMock</div>
}));

vi.mock('../components/FarmasiPanel.jsx', () => ({
    default: () => <div>FarmasiPanelMock</div>
}));

vi.mock('../components/ServiceCardDeck.jsx', () => ({
    default: () => <div>ServiceCardDeckMock</div>
}));

vi.mock('../data/ClinicalServices.js', () => ({
    CLINICAL_SERVICES: [
        {
            id: 'poli_umum',
            name: 'Poli Umum',
            shortName: 'Umum',
            queueType: 'queue',
            color: 'from-emerald-600 to-teal-600',
            description: 'Pelayanan umum',
            icon: 'U',
            unlockLevel: 1,
            betaLocked: false
        },
        {
            id: 'igd',
            name: 'IGD',
            shortName: 'IGD',
            queueType: 'emergency',
            color: 'from-red-600 to-rose-600',
            description: 'Pelayanan gawat darurat',
            icon: 'E',
            unlockLevel: 1,
            betaLocked: false
        }
    ],
    isServiceUnlocked: () => true
}));

vi.mock('../game/EmergencyCases.js', () => ({
    TRIAGE_LEVELS: {
        1: { name: 'Resus' },
        2: { name: 'Emergensi' },
        3: { name: 'Urgensi' }
    }
}));

vi.mock('../utils/AvatarUtils.js', () => ({
    getAvatarStyle: () => ({ width: 40, height: 40, backgroundColor: '#ddd' }),
    normalizeGender: (value) => {
        const normalized = String(value || '').trim().toUpperCase();
        return ['P', 'F', 'FEMALE', 'PEREMPUAN'].includes(normalized) ? 'P' : 'L';
    }
}));

vi.mock('../utils/ToastManager.js', () => ({
    showToast: vi.fn()
}));

vi.mock('../utils/clinicalRouting.js', () => ({
    filterQueueByService: (queue = []) => queue,
    isClinicalServiceOpen: () => true,
    isPatientAssignedToService: (patient, serviceId) => patient.serviceId === serviceId
}));

import ClinicalPage from '../components/ClinicalPage.jsx';

describe('ClinicalPage responsive workflow', () => {
    const basePatient = {
        id: 'patient-1',
        name: 'Siti Hadi',
        age: 42,
        gender: 'Perempuan',
        joinedAt: 500,
        serviceId: 'poli_umum',
        social: {
            hasBPJS: true,
            isResident: true
        }
    };
    const buildGameState = (overrides = {}) => ({
        emergencyQueue: [],
        activeEmergencyId: null,
        admitEmergencyPatient: vi.fn(),
        dischargeEmergencyPatient: vi.fn(),
        activePatientId: null,
        playerStats: { level: 1 },
        time: 540,
        day: 1,
        morningStatus: 'normal',
        takeLoungeRest: vi.fn(() => ({ success: true })),
        loungeRestCount: 0,
        queue: [basePatient],
        hiredStaff: [],
        admitPatient: vi.fn(),
        history: [],
        prolanisRoster: [],
        pharmacyInventory: {},
        consumeMedication: vi.fn(),
        markPrescriptionDispensed: vi.fn(),
        ...overrides
    });

    beforeEach(() => {
        currentLanguage = 'id';
        mockUseGame.mockReturnValue(buildGameState());
    });

    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('keeps the sidebar queue panel visible on tablet widths', () => {
        window.innerWidth = 1024;

        render(<ClinicalPage />);

        expect(screen.getByTestId('clinical-sidebar-panel')).toBeInTheDocument();
        expect(screen.getByText('QueueListMock')).toBeInTheDocument();
    });

    it('collapses the sidebar queue panel below tablet breakpoint', () => {
        window.innerWidth = 900;

        render(<ClinicalPage />);

        expect(screen.queryByTestId('clinical-sidebar-panel')).not.toBeInTheDocument();
        expect(screen.queryByText('QueueListMock')).not.toBeInTheDocument();
    });

    it('calls the next patient directly from the empty work area spotlight', () => {
        const admitPatient = vi.fn();
        window.innerWidth = 1366;
        mockUseGame.mockReturnValue(buildGameState({ queue: [basePatient], admitPatient }));

        render(<ClinicalPage />);

        fireEvent.click(screen.getByRole('button', { name: 'Panggil pasien berikutnya' }));

        expect(admitPatient).toHaveBeenCalledWith('patient-1');
    });

    it('localizes spotlight copy and patient identity when English is active', () => {
        currentLanguage = 'en';
        window.innerWidth = 1366;

        render(<ClinicalPage />);

        expect(screen.getByText('Clinic is ready. Call the next patient.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Call next patient' })).toBeInTheDocument();
        expect(screen.getAllByText('42 y.o. | Female | Resident').length).toBeGreaterThan(0);
    });
});
