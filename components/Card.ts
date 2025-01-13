export enum Effects {
    Damage = "Damage",
    Stun = "Stun",
    Bleed = "Bleed",
    Shield = "Shield"
}

export enum Targets {
    Self = "Self",
    Enemy = "Enemy",
    Ally = "Ally",
    AllEnemies = "All Enemies",
    AllAllies = "All Allies"
}

Object.freeze(Effects);
Object.freeze(Targets)

export class CardEffect {
    name: string;
    duration: number;
    target: Targets;

    constructor(name: Effects, duration: number, target: Targets){
        this.name = name;
        this.duration = duration;
        this.target = target;
    }
}

export interface CardParams {
    name: string; // card name, max 50 characters
    description: string; // card description, max 200 characters
    mastery: number; // card mastery, 0-100
    spiritCost: number; // spirit cost, 0-100
    art: string; // file path of card art
    sequence: number; // card sequence, 0-9
    pathway: string; // pathway
    pathwayGroup: string; // pathway group
    effects: CardEffect[]; // list of card effects
}

export class Card {
    name: string; // card name, max 50 characters
    description: string; // card description, max 200 characters
    mastery: number; // card mastery, 0-100
    spiritCost: number; // spirit cost, 0-100
    art: string; // file path of card art
    sequence: number; // card sequence, 0-9
    pathway: string; // pathway
    pathwayGroup: string; // pathway group
    effects: CardEffect[]; //list of card effects

    constructor({name, description, mastery, spiritCost, art, sequence, pathway, pathwayGroup, effects} : CardParams){
        this.name = name;
        this.description = description;
        this.mastery = mastery;
        this.spiritCost = spiritCost;
        this.art = art;
        this.sequence = sequence;
        this.pathway = pathway;
        this.pathwayGroup = pathwayGroup;
        this.effects = effects;
    }
}