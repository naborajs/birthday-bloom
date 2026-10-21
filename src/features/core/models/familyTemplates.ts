export const FAMILY_TEMPLATE_VERSION = '3.0.0';
export type AgeGroup = 'child' | 'teen' | 'young-adult' | 'adult' | 'senior';
export type Gender = 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';
export type PrivacyLevel = 'public' | 'family' | 'private';
export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'url';
export type RelationshipDirection = 'ancestor' | 'descendant' | 'sibling' | 'extended' | 'chosen' | 'custom';
export type RelationshipCloseness = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type FamilyMemberType = 'brother' | 'sister' | 'father' | 'mother' | 'grandfather' | 'grandmother' | 'uncle' | 'aunt' | 'cousin' | 'son' | 'daughter' | 'guardian' | 'friend' | 'custom';
export type FamilyMemberCategory = 'sibling' | 'parent' | 'grandparent' | 'relative' | 'child' | 'guardian' | 'friend' | 'custom';
export interface DynamicFieldDefinition {
    id: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    description?: string;
    options?: string[];
    defaultValue?: string | number | boolean | string[];
    privacy?: PrivacyLevel;
}
export interface DynamicFieldValue {
    fieldId: string;
    value: string | number | boolean | string[] | null;
    updatedAt: Date;
}
export interface RelationshipMetadata {
    memberType: FamilyMemberType;
    category: FamilyMemberCategory;
    relationshipLabel: string;
    direction: RelationshipDirection;
    closenessLevel: RelationshipCloseness;
    yearsKnown?: number;
    isBloodRelation?: boolean;
    isChosenFamily?: boolean;
    familySide?: 'maternal' | 'paternal' | 'both' | 'chosen' | 'unknown';
    householdRole?: string;
    customTags?: string[];
}
export interface FamilyTimelineEntry {
    id: string;
    title: string;
    date?: Date;
    description?: string;
    mediaIds?: string[];
    participants?: string[];
    privacy?: PrivacyLevel;
}
export interface FamilyMediaItem {
    id: string;
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    title?: string;
    altText?: string;
    caption?: string;
    tags?: string[];
    capturedAt?: Date;
    privacy?: PrivacyLevel;
}
export interface PrivacyControls {
    defaultLevel: PrivacyLevel;
    hiddenFields?: string[];
    privateNoteIds?: string[];
    privateMediaIds?: string[];
    allowExport?: boolean;
}
export interface BaseFamilyMemberProfile {
    schemaVersion: string;
    id: string;
    memberType: FamilyMemberType;
    basicInfo: {
        fullName: string;
        preferredName?: string;
        nicknames: string[];
        gender: Gender;
        ageGroup: AgeGroup;
        dateOfBirth?: Date;
        pronouns?: string;
        location?: string;
    };
    relationship: RelationshipMetadata;
    identity: {
        occupation?: string;
        education?: string;
        hometown?: string;
        currentCity?: string;
        languages?: string[];
    };
    personality: {
        traits: string[];
        strengths: string[];
        growthAreas?: string[];
        communicationStyle?: string;
    };
    interests: {
        hobbies: string[];
        favoriteActivities: string[];
        favoriteFood?: string[];
        favoriteColors?: string[];
        music?: string[];
        moviesOrShows?: string[];
        books?: string[];
        customInterests?: Record<string, string[]>;
    };
    bond: {
        sharedMemories: string[];
        favoriteMemoryTogether?: string;
        sharedActivities: string[];
        communicationFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'rare';
        supportStyle?: string;
    };
    personalNotes: {
        publicMessage?: string;
        privateReflection?: string;
        whatMakesThemSpecial?: string;
        gratitudeNotes?: string[];
    };
    timeline: FamilyTimelineEntry[];
    media: FamilyMediaItem[];
    dynamicFields: DynamicFieldValue[];
    privacy: PrivacyControls;
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        source?: 'manual' | 'import' | 'migration';
    };
}
export interface SiblingFields {
    siblingRole: 'older' | 'younger' | 'twin' | 'step' | 'cousin-sibling' | 'chosen';
    childhoodMemories: string[];
    siblingTraditions?: string[];
    friendlyRivalries?: string[];
}
export interface ParentFields {
    parentalRole: 'father' | 'mother' | 'step-parent' | 'adoptive-parent' | 'parent-figure';
    guidanceStyle?: string;
    familyTraditions?: string[];
    lessonsTaught?: string[];
}
export interface GrandparentFields {
    grandparentRole: 'grandfather' | 'grandmother' | 'great-grandparent';
    familyLegacy?: string[];
    storiesPassedDown?: string[];
    wisdomShared?: string[];
}
export interface RelativeFields {
    relativeRole: 'uncle' | 'aunt' | 'cousin' | 'relative';
    familySide?: 'maternal' | 'paternal' | 'both' | 'unknown';
    gatheringMemories?: string[];
    familyConnectionNotes?: string;
}
export interface ChildFields {
    childRole: 'son' | 'daughter' | 'child' | 'step-child' | 'adoptive-child';
    milestones?: string[];
    growthNotes?: string[];
    hopesForFuture?: string[];
}
export interface GuardianFields {
    guardianRole: 'guardian' | 'caregiver' | 'mentor-guardian';
    careRelationship?: string;
    supportResponsibilities?: string[];
    trustNotes?: string[];
}
export interface FriendFields {
    friendshipType: 'best-friend' | 'close-friend' | 'family-friend' | 'chosen-family';
    originStory?: string;
    sharedAdventures?: string[];
    insideJokes?: string[];
}
export interface CustomMemberFields {
    customTypeLabel: string;
    customRelationshipDescription?: string;
    customSections: Record<string, unknown>;
}
export type BrotherProfile = BaseFamilyMemberProfile & {
    memberType: 'brother';
    specialized: SiblingFields;
};
export type SisterProfile = BaseFamilyMemberProfile & {
    memberType: 'sister';
    specialized: SiblingFields;
};
export type FatherProfile = BaseFamilyMemberProfile & {
    memberType: 'father';
    specialized: ParentFields;
};
export type MotherProfile = BaseFamilyMemberProfile & {
    memberType: 'mother';
    specialized: ParentFields;
};
export type GrandfatherProfile = BaseFamilyMemberProfile & {
    memberType: 'grandfather';
    specialized: GrandparentFields;
};
export type GrandmotherProfile = BaseFamilyMemberProfile & {
    memberType: 'grandmother';
    specialized: GrandparentFields;
};
export type UncleProfile = BaseFamilyMemberProfile & {
    memberType: 'uncle';
    specialized: RelativeFields;
};
export type AuntProfile = BaseFamilyMemberProfile & {
    memberType: 'aunt';
    specialized: RelativeFields;
};
export type CousinProfile = BaseFamilyMemberProfile & {
    memberType: 'cousin';
    specialized: RelativeFields;
};
export type SonProfile = BaseFamilyMemberProfile & {
    memberType: 'son';
    specialized: ChildFields;
};
export type DaughterProfile = BaseFamilyMemberProfile & {
    memberType: 'daughter';
    specialized: ChildFields;
};
export type GuardianProfile = BaseFamilyMemberProfile & {
    memberType: 'guardian';
    specialized: GuardianFields;
};
export type FriendProfile = BaseFamilyMemberProfile & {
    memberType: 'friend';
    specialized: FriendFields;
};
export type CustomMemberProfile = BaseFamilyMemberProfile & {
    memberType: 'custom';
    specialized: CustomMemberFields;
};
export type FamilyMemberProfile = BrotherProfile | SisterProfile | FatherProfile | MotherProfile | GrandfatherProfile | GrandmotherProfile | UncleProfile | AuntProfile | CousinProfile | SonProfile | DaughterProfile | GuardianProfile | FriendProfile | CustomMemberProfile;
export interface FamilyTemplateDefinition<TSpecialized = unknown> {
    type: FamilyMemberType;
    label: string;
    category: FamilyMemberCategory;
    description: string;
    baseFields: DynamicFieldDefinition[];
    specializedFields: DynamicFieldDefinition[];
    defaults: {
        gender: Gender;
        ageGroup: AgeGroup;
        relationship: Omit<RelationshipMetadata, 'memberType' | 'category'>;
        specialized: TSpecialized;
    };
    version: string;
}
const now = () => new Date();
const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const BASE_DYNAMIC_FIELDS: DynamicFieldDefinition[] = [
    { id: 'favorite-memory', label: 'Favorite memory', type: 'textarea' },
    { id: 'birthday-message', label: 'Birthday message', type: 'textarea' },
    { id: 'private-note', label: 'Private note', type: 'textarea', privacy: 'private' },
];
const siblingFields: DynamicFieldDefinition[] = [
    { id: 'childhood-story', label: 'Childhood story', type: 'textarea' },
    { id: 'sibling-tradition', label: 'Sibling tradition', type: 'text' },
    { id: 'inside-joke', label: 'Inside joke & laughter', type: 'text' },
    { id: 'proud-moment', label: 'Proudest sibling moment', type: 'textarea' },
];
const parentFields: DynamicFieldDefinition[] = [
    { id: 'life-lesson', label: 'Life lesson', type: 'textarea' },
    { id: 'family-tradition', label: 'Family tradition', type: 'text' },
    { id: 'gratitude-message', label: 'Heartfelt gratitude', type: 'textarea' },
    { id: 'favorite-advice', label: 'Unforgettable piece of advice', type: 'text' },
];
const grandparentFields: DynamicFieldDefinition[] = [
    { id: 'legacy-story', label: 'Legacy story', type: 'textarea' },
    { id: 'wisdom-shared', label: 'Wisdom shared', type: 'textarea' },
];
const relativeFields: DynamicFieldDefinition[] = [
    { id: 'family-side-note', label: 'Family side note', type: 'text' },
    { id: 'gathering-memory', label: 'Gathering memory', type: 'textarea' },
];
const childFields: DynamicFieldDefinition[] = [
    { id: 'milestone', label: 'Milestone', type: 'textarea' },
    { id: 'hope-for-future', label: 'Hope for the future', type: 'textarea' },
];
const guardianFields: DynamicFieldDefinition[] = [
    { id: 'support-note', label: 'Support note', type: 'textarea' },
    { id: 'care-role', label: 'Care role', type: 'text' },
];
const friendFields: DynamicFieldDefinition[] = [
    { id: 'origin-story', label: 'Origin story', type: 'textarea' },
    { id: 'shared-adventure', label: 'Shared adventure', type: 'textarea' },
];
const customFields: DynamicFieldDefinition[] = [
    { id: 'custom-relationship', label: 'Custom relationship', type: 'text', required: true },
    { id: 'custom-story', label: 'Custom story', type: 'textarea' },
];
export const FAMILY_TEMPLATE_REGISTRY = {
    brother: template<SiblingFields>('brother', 'Brother', 'sibling', 'A dedicated template for brothers.', 'male', {
        relationshipLabel: 'Brother',
        direction: 'sibling',
        closenessLevel: 7,
        isBloodRelation: true,
    }, { siblingRole: 'younger', childhoodMemories: [] }, siblingFields),
    sister: template<SiblingFields>('sister', 'Sister', 'sibling', 'A dedicated template for sisters.', 'female', {
        relationshipLabel: 'Sister',
        direction: 'sibling',
        closenessLevel: 7,
        isBloodRelation: true,
    }, { siblingRole: 'younger', childhoodMemories: [] }, siblingFields),
    father: template<ParentFields>('father', 'Father', 'parent', 'A parent template for fathers and father figures.', 'male', {
        relationshipLabel: 'Father',
        direction: 'ancestor',
        closenessLevel: 8,
        isBloodRelation: true,
    }, { parentalRole: 'father', lessonsTaught: [] }, parentFields),
    mother: template<ParentFields>('mother', 'Mother', 'parent', 'A parent template for mothers and mother figures.', 'female', {
        relationshipLabel: 'Mother',
        direction: 'ancestor',
        closenessLevel: 8,
        isBloodRelation: true,
    }, { parentalRole: 'mother', lessonsTaught: [] }, parentFields),
    grandfather: template<GrandparentFields>('grandfather', 'Grandfather', 'grandparent', 'A legacy-focused template for grandfathers.', 'male', {
        relationshipLabel: 'Grandfather',
        direction: 'ancestor',
        closenessLevel: 8,
        isBloodRelation: true,
    }, { grandparentRole: 'grandfather', familyLegacy: [], wisdomShared: [] }, grandparentFields),
    grandmother: template<GrandparentFields>('grandmother', 'Grandmother', 'grandparent', 'A legacy-focused template for grandmothers.', 'female', {
        relationshipLabel: 'Grandmother',
        direction: 'ancestor',
        closenessLevel: 8,
        isBloodRelation: true,
    }, { grandparentRole: 'grandmother', familyLegacy: [], wisdomShared: [] }, grandparentFields),
    uncle: template<RelativeFields>('uncle', 'Uncle', 'relative', 'An extended-family template for uncles.', 'male', {
        relationshipLabel: 'Uncle',
        direction: 'extended',
        closenessLevel: 6,
        isBloodRelation: true,
    }, { relativeRole: 'uncle', gatheringMemories: [] }, relativeFields),
    aunt: template<RelativeFields>('aunt', 'Aunt', 'relative', 'An extended-family template for aunts.', 'female', {
        relationshipLabel: 'Aunt',
        direction: 'extended',
        closenessLevel: 6,
        isBloodRelation: true,
    }, { relativeRole: 'aunt', gatheringMemories: [] }, relativeFields),
    cousin: template<RelativeFields>('cousin', 'Cousin', 'relative', 'A flexible template for cousins.', 'other', {
        relationshipLabel: 'Cousin',
        direction: 'extended',
        closenessLevel: 6,
        isBloodRelation: true,
    }, { relativeRole: 'cousin', gatheringMemories: [] }, relativeFields),
    son: template<ChildFields>('son', 'Son', 'child', 'A child template for sons.', 'male', {
        relationshipLabel: 'Son',
        direction: 'descendant',
        closenessLevel: 9,
        isBloodRelation: true,
    }, { childRole: 'son', milestones: [], hopesForFuture: [] }, childFields),
    daughter: template<ChildFields>('daughter', 'Daughter', 'child', 'A child template for daughters.', 'female', {
        relationshipLabel: 'Daughter',
        direction: 'descendant',
        closenessLevel: 9,
        isBloodRelation: true,
    }, { childRole: 'daughter', milestones: [], hopesForFuture: [] }, childFields),
    guardian: template<GuardianFields>('guardian', 'Guardian', 'guardian', 'A care-centered template for guardians.', 'other', {
        relationshipLabel: 'Guardian',
        direction: 'ancestor',
        closenessLevel: 8,
        isBloodRelation: false,
        isChosenFamily: true,
    }, { guardianRole: 'guardian', supportResponsibilities: [], trustNotes: [] }, guardianFields),
    friend: template<FriendFields>('friend', 'Friend', 'friend', 'An optional chosen-family extension for friends.', 'other', {
        relationshipLabel: 'Friend',
        direction: 'chosen',
        closenessLevel: 7,
        isBloodRelation: false,
        isChosenFamily: true,
    }, { friendshipType: 'close-friend', sharedAdventures: [], insideJokes: [] }, friendFields),
    custom: template<CustomMemberFields>('custom', 'Custom Member', 'custom', 'A future-proof template for any relationship.', 'other', {
        relationshipLabel: 'Custom member',
        direction: 'custom',
        closenessLevel: 5,
        isBloodRelation: false,
    }, { customTypeLabel: 'Custom member', customSections: {} }, customFields),
} satisfies Record<FamilyMemberType, FamilyTemplateDefinition>;
function template<TSpecialized>(type: FamilyMemberType, label: string, category: FamilyMemberCategory, description: string, gender: Gender, relationship: Omit<RelationshipMetadata, 'memberType' | 'category'>, specialized: TSpecialized, specializedFields: DynamicFieldDefinition[]): FamilyTemplateDefinition<TSpecialized> {
    return {
        type,
        label,
        category,
        description,
        baseFields: BASE_DYNAMIC_FIELDS,
        specializedFields,
        defaults: {
            gender,
            ageGroup: 'adult',
            relationship,
            specialized,
        },
        version: FAMILY_TEMPLATE_VERSION,
    };
}
export interface CreateFamilyMemberOptions {
    id?: string;
    preferredName?: string;
    nicknames?: string[];
    gender?: Gender;
    ageGroup?: AgeGroup;
    relationshipOverrides?: Partial<RelationshipMetadata>;
    dynamicFields?: DynamicFieldValue[];
    privacy?: Partial<PrivacyControls>;
    specialized?: Partial<SiblingFields & ParentFields & GrandparentFields & RelativeFields & ChildFields & GuardianFields & FriendFields & CustomMemberFields>;
}
export const createFamilyMemberProfile = (memberType: FamilyMemberType, fullName: string, dateOfBirth?: Date, options: CreateFamilyMemberOptions = {}): FamilyMemberProfile => {
    const definition = FAMILY_TEMPLATE_REGISTRY[memberType];
    const timestamp = now();
    const profile = {
        schemaVersion: definition.version,
        id: options.id ?? createId(memberType),
        memberType,
        basicInfo: {
            fullName,
            preferredName: options.preferredName,
            nicknames: options.nicknames ?? [],
            gender: options.gender ?? definition.defaults.gender,
            ageGroup: options.ageGroup ?? definition.defaults.ageGroup,
            dateOfBirth,
        },
        relationship: {
            ...definition.defaults.relationship,
            ...options.relationshipOverrides,
            memberType,
            category: definition.category,
        },
        identity: {},
        personality: {
            traits: [],
            strengths: [],
        },
        interests: {
            hobbies: [],
            favoriteActivities: [],
        },
        bond: {
            sharedMemories: [],
            sharedActivities: [],
        },
        personalNotes: {},
        timeline: [],
        media: [],
        dynamicFields: options.dynamicFields ?? [],
        privacy: {
            defaultLevel: 'family',
            allowExport: true,
            ...options.privacy,
        },
        specialized: {
            ...definition.defaults.specialized,
            ...options.specialized,
        },
        metadata: {
            createdAt: timestamp,
            updatedAt: timestamp,
            tags: [definition.category, memberType],
            source: 'manual',
        },
    };
    return profile as FamilyMemberProfile;
};
export const createCustomFamilyMemberTemplate = (typeLabel: string, fields: DynamicFieldDefinition[] = []): FamilyTemplateDefinition<CustomMemberFields> => ({
    ...FAMILY_TEMPLATE_REGISTRY.custom,
    label: typeLabel,
    description: `Custom member template for ${typeLabel}.`,
    specializedFields: [...FAMILY_TEMPLATE_REGISTRY.custom.specializedFields, ...fields],
    defaults: {
        ...FAMILY_TEMPLATE_REGISTRY.custom.defaults,
        specialized: {
            customTypeLabel: typeLabel,
            customSections: {},
        },
    },
});
export const getFamilyTemplateDefinition = (memberType: FamilyMemberType) => FAMILY_TEMPLATE_REGISTRY[memberType];
export const getAllFamilyTemplateDefinitions = () => Object.values(FAMILY_TEMPLATE_REGISTRY);
export const validateFamilyMemberProfile = (profile: Partial<BaseFamilyMemberProfile>): string[] => {
    const errors: string[] = [];
    if (!profile.id)
        errors.push('id is required');
    if (!profile.schemaVersion)
        errors.push('schemaVersion is required');
    if (!profile.memberType || !(profile.memberType in FAMILY_TEMPLATE_REGISTRY)) {
        errors.push('memberType must be a registered family template type');
    }
    if (!profile.basicInfo?.fullName?.trim())
        errors.push('basicInfo.fullName is required');
    if (profile.basicInfo?.dateOfBirth && Number.isNaN(new Date(profile.basicInfo.dateOfBirth).getTime())) {
        errors.push('basicInfo.dateOfBirth must be a valid date');
    }
    const closeness = profile.relationship?.closenessLevel;
    if (closeness !== undefined && (!Number.isInteger(closeness) || closeness < 1 || closeness > 10)) {
        errors.push('relationship.closenessLevel must be between 1 and 10');
    }
    return errors;
};
export const migrateLegacyFamilyMember = (legacy: {
    id?: string;
    type?: string;
    name?: string;
    dateOfBirth?: Date;
    profileData?: Record<string, unknown>;
}): FamilyMemberProfile => {
    const requestedType = legacy.type === 'brother' || legacy.type === 'sister' ? legacy.type : 'custom';
    const migrated = createFamilyMemberProfile(requestedType, legacy.name ?? 'Family Member', legacy.dateOfBirth, {
        id: legacy.id,
        relationshipOverrides: {
            customTags: ['migrated'],
        },
        specialized: requestedType === 'custom'
            ? {
                customTypeLabel: legacy.type ?? 'Legacy member',
                customSections: legacy.profileData ?? {},
            }
            : undefined,
    });
    migrated.metadata.source = 'migration';
    return migrated;
};
export const createDefaultBrotherProfile = (name: string, dob: Date): BrotherProfile => createFamilyMemberProfile('brother', name, dob, {
    gender: 'male',
    specialized: { siblingRole: 'younger' },
}) as BrotherProfile;
export const createDefaultSisterProfile = (name: string, dob: Date): SisterProfile => createFamilyMemberProfile('sister', name, dob, {
    gender: 'female',
    specialized: { siblingRole: 'younger' },
}) as SisterProfile;
export const createDefaultFatherProfile = (name: string, dob?: Date): FatherProfile => createFamilyMemberProfile('father', name, dob) as FatherProfile;
export const createDefaultMotherProfile = (name: string, dob?: Date): MotherProfile => createFamilyMemberProfile('mother', name, dob) as MotherProfile;
export const createDefaultGrandfatherProfile = (name: string, dob?: Date): GrandfatherProfile => createFamilyMemberProfile('grandfather', name, dob) as GrandfatherProfile;
export const createDefaultGrandmotherProfile = (name: string, dob?: Date): GrandmotherProfile => createFamilyMemberProfile('grandmother', name, dob) as GrandmotherProfile;
export const createDefaultUncleProfile = (name: string, dob?: Date): UncleProfile => createFamilyMemberProfile('uncle', name, dob) as UncleProfile;
export const createDefaultAuntProfile = (name: string, dob?: Date): AuntProfile => createFamilyMemberProfile('aunt', name, dob) as AuntProfile;
export const createDefaultCousinProfile = (name: string, dob?: Date): CousinProfile => createFamilyMemberProfile('cousin', name, dob) as CousinProfile;
export const createDefaultSonProfile = (name: string, dob?: Date): SonProfile => createFamilyMemberProfile('son', name, dob) as SonProfile;
export const createDefaultDaughterProfile = (name: string, dob?: Date): DaughterProfile => createFamilyMemberProfile('daughter', name, dob) as DaughterProfile;
export const createDefaultGuardianProfile = (name: string, dob?: Date): GuardianProfile => createFamilyMemberProfile('guardian', name, dob) as GuardianProfile;
export const createDefaultFriendProfile = (name: string, dob?: Date): FriendProfile => createFamilyMemberProfile('friend', name, dob) as FriendProfile;
