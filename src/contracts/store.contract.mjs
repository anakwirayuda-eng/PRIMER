/**
 * @reflection
 * [IDENTITY]: store.contract
 * [PURPOSE]: Define the structural requirements for useGameStore.
 */

export const STORE_CONTRACT = {
    slices: {
        player: {
            requiredKeys: ['profile'],
            types: { profile: 'object' }
        },
        world: {
            requiredKeys: ['time', 'day', 'isPaused'],
            types: { time: 'number', day: 'number' }
        },
        finance: {
            requiredKeys: ['stats', 'pharmacyInventory'],
            types: { stats: 'object' }
        },
        publicHealth: {
            requiredKeys: ['villageData', 'prolanisRoster', 'activeOutbreaks'],
            types: { villageData: 'object' }
        },
        clinical: {
            requiredKeys: ['queue', 'activePatientId', 'history'],
            types: { queue: 'object', activePatientId: 'string' }
        }
    },
    actions: {
        clinicalActions: [
            'dischargePatient', 'updatePatient', 'orderLab'
        ],
        publicHealthActions: [
            'enrollProlanis'
        ],
        navActions: [
            'navigate'
        ],
        metaActions: [
            'openWiki', 'closeWiki'
        ]
    }
};
