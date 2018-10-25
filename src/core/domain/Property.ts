export class Property {
    constructor(public Name: string = "", public Value: string = "") {
    }

    public equals(property: Property) : boolean {
        if (this.Name !== property.Name) return false;
        if (this.Value !== property.Value) return false;
        return true;
    }
}
