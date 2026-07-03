import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }) => <div data-testid="mock-r3f-canvas">{children}</div>,
    useFrame: () => {},
    useThree: () => ({ gl: null })
}));

vi.mock('@react-three/drei', () => ({
    PerspectiveCamera: () => null
}));

vi.mock('../components/wilayah/3d/DioramaSceneCore.jsx', () => ({
    default: () => null
}));

import PocketDioramaCanvas from '../components/wilayah/3d/PocketDioramaCanvas.jsx';
import i18n from '../i18n.js';

describe('PocketDioramaCanvas', () => {
    it('renders a safe fallback when scope data is missing', () => {
        render(<PocketDioramaCanvas mapData={null} />);

        expect(screen.getByTestId('pocket-diorama-fallback')).toBeInTheDocument();
        expect(
            screen.getByText(
                i18n.t('wilayahContent.ui.dioramaInspector.fallbackTitle', { defaultValue: 'Pocket Diorama' })
            )
        ).toBeInTheDocument();
    });
});
