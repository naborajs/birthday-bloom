import { describe, it, expect } from 'vitest';
import { en } from '@/i18n/locales/en';
import { bn } from '@/i18n/locales/bn';
import { hi } from '@/i18n/locales/hi';
import { fr } from '@/i18n/locales/fr';
import { FAMILY_TEMPLATE_REGISTRY } from '@/features/core/models/familyTemplates';

describe('Deep Relationship Templates & Multilingual Wish Matrix', () => {
    it('verifies brother and sister templates in family registry have expanded emotional fields', () => {
        const brother = FAMILY_TEMPLATE_REGISTRY.brother;
        const sister = FAMILY_TEMPLATE_REGISTRY.sister;

        expect(brother).toBeDefined();
        expect(sister).toBeDefined();

        const brotherFields = brother.specializedFields.map(f => f.id);
        expect(brotherFields).toContain('childhood-story');
        expect(brotherFields).toContain('inside-joke');
        expect(brotherFields).toContain('proud-moment');

        const sisterFields = sister.specializedFields.map(f => f.id);
        expect(sisterFields).toContain('childhood-story');
        expect(sisterFields).toContain('inside-joke');
        expect(sisterFields).toContain('proud-moment');
    });

    it('verifies mother and father templates have gratitude and advice fields', () => {
        const mother = FAMILY_TEMPLATE_REGISTRY.mother;
        const father = FAMILY_TEMPLATE_REGISTRY.father;

        expect(mother).toBeDefined();
        expect(father).toBeDefined();

        const motherFields = mother.specializedFields.map(f => f.id);
        expect(motherFields).toContain('gratitude-message');
        expect(motherFields).toContain('favorite-advice');

        const fatherFields = father.specializedFields.map(f => f.id);
        expect(fatherFields).toContain('gratitude-message');
        expect(fatherFields).toContain('favorite-advice');
    });

    it('validates English guestbook default wishes contain brother and sister', () => {
        expect(en.guestbook.defaultWishes.brother).toBeDefined();
        expect(en.guestbook.defaultWishes.brother.length).toBeGreaterThan(10);
        expect(en.guestbook.defaultWishes.sister).toBeDefined();
        expect(en.guestbook.defaultWishes.sister.length).toBeGreaterThan(10);
    });

    it('validates Bengali guestbook default wishes contain brother and sister', () => {
        expect(bn.guestbook.defaultWishes.brother).toBeDefined();
        expect(bn.guestbook.defaultWishes.brother.length).toBeGreaterThan(10);
        expect(bn.guestbook.defaultWishes.sister).toBeDefined();
        expect(bn.guestbook.defaultWishes.sister.length).toBeGreaterThan(10);
    });

    it('validates Hindi guestbook default wishes contain brother and sister', () => {
        expect(hi.guestbook.defaultWishes.brother).toBeDefined();
        expect(hi.guestbook.defaultWishes.brother.length).toBeGreaterThan(10);
        expect(hi.guestbook.defaultWishes.sister).toBeDefined();
        expect(hi.guestbook.defaultWishes.sister.length).toBeGreaterThan(10);
    });

    it('validates French guestbook default wishes contain brother and sister', () => {
        expect(fr.guestbook.defaultWishes.brother).toBeDefined();
        expect(fr.guestbook.defaultWishes.brother.length).toBeGreaterThan(10);
        expect(fr.guestbook.defaultWishes.sister).toBeDefined();
        expect(fr.guestbook.defaultWishes.sister.length).toBeGreaterThan(10);
    });
});
