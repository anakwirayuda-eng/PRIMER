import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
