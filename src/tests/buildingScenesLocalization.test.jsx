import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import i18n from '../i18n.js';
import enWilayah from '../locales/wilayah/en.js';
import idWilayah from '../locales/wilayah/id.js';
import BuildingGamePanel from '../components/wilayah/BuildingGamePanel.jsx';
import EliteCOMBWheel from '../components/wilayah/EliteCOMBWheel.jsx';
import { GAME_ENABLED_BUILDINGS, getSceneForBuilding } from '../components/wilayah/buildingScenes.js';
import { getWilayahLayerMeta } from '../components/wilayah/layerMeta.js';

describe('Wilayah localization', () => {
    let previousLanguage = 'id';

    beforeEach(async () => {
        previousLanguage = i18n.language || 'id';
        await act(async () => {
            await i18n.changeLanguage('en');
        });
    });

    afterEach(async () => {
        await act(async () => {
            await i18n.changeLanguage(previousLanguage);
        });
    });

    it('localizes scene data and building shell copy in English', () => {
        const scene = getSceneForBuilding('posyandu', i18n.t.bind(i18n));
        const layer = getWilayahLayerMeta('general', i18n.t.bind(i18n));

        expect(scene.title).toBe('Sukamaju Village Integrated Health Post (Posyandu)');
        expect(scene.stations[0].actions[0].label).toBe('Check Attendance List');
        expect(layer.label).toBe('Infrastructure');

        render(
            <BuildingGamePanel
                buildingType="posyandu"
                energy={24}
                onAction={() => {}}
                onClose={() => {}}
                onXpGain={() => {}}
                onComplete={() => {}}
            />
        );

        expect(screen.getByRole('button', { name: /exit/i })).toBeInTheDocument();
        expect(screen.getByText('Registration')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Registration'));

        expect(screen.getByText('Available Actions')).toBeInTheDocument();
        expect(screen.getByText('Check Attendance List')).toBeInTheDocument();
        expect(screen.getByText('Findings')).toBeInTheDocument();
    });

    it('localizes deep market scene content in English instead of falling back to Indonesian', () => {
        const marketScene = getSceneForBuilding('market', i18n.t.bind(i18n));
        const healerScene = getSceneForBuilding('padepokan_dukun', i18n.t.bind(i18n));

        expect(marketScene.title).toBe('Sukamaju Village Market');
        expect(marketScene.subtitle).toBe('Food Safety and Environmental Health in the Marketplace');
        expect(marketScene.stations[0].label).toBe('Wet Market Area (Meat and Fish)');
        expect(marketScene.stations[0].actions[0].label).toBe('Inspect Meat Color, Smell, and Texture');
        expect(marketScene.npcs[0].greeting).toMatch(/clinic is inspecting/i);
        expect(healerScene.stations[0].label).toBe('Ritual and Consultation Room');
        expect(healerScene.npcs[0].greeting).toMatch(/feel heard/i);
    });

    it('localizes COM-B wheel chrome in English', () => {
        render(<EliteCOMBWheel activeBarriers={['cap_psy']} size={320} />);

        expect(screen.getByText('The Behaviour Change Wheel')).toBeInTheDocument();
        expect(screen.getByText('Capability')).toBeInTheDocument();
        expect(screen.getByText('PRIMER Behavioral Science Engine')).toBeInTheDocument();
    });

    it('ships deep bilingual locale data for every game-enabled building scene', () => {
        const enScenes = enWilayah?.wilayahContent?.buildingScenes || {};
        const idScenes = idWilayah?.wilayahContent?.buildingScenes || {};
        const expectedIds = [...GAME_ENABLED_BUILDINGS].sort();

        expect(Object.keys(enScenes).sort()).toEqual(expectedIds);
        expect(Object.keys(idScenes).sort()).toEqual(expectedIds);

        for (const sceneId of GAME_ENABLED_BUILDINGS) {
            expect(enScenes[sceneId]?.ambience).toBeTruthy();
            expect(idScenes[sceneId]?.ambience).toBeTruthy();
            expect(Object.keys(enScenes[sceneId]?.stations || {}).length).toBeGreaterThan(0);
            expect(Object.keys(idScenes[sceneId]?.stations || {}).length).toBeGreaterThan(0);
            expect(Object.keys(enScenes[sceneId]?.npcs || {}).length).toBeGreaterThan(0);
            expect(Object.keys(idScenes[sceneId]?.npcs || {}).length).toBeGreaterThan(0);
            expect(enScenes[sceneId]?.completionReward?.message).toBeTruthy();
            expect(idScenes[sceneId]?.completionReward?.message).toBeTruthy();
        }
    });
});
